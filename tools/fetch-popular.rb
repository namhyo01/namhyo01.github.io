#!/usr/bin/env ruby
# frozen_string_literal: true

# GoatCounter 에서 조회수 상위 글을 받아 _data/popular.yml 로 저장합니다.
# 빌드 시점에 한 번만 돌기 때문에 방문자는 추가 요청을 하지 않고,
# API 토큰도 브라우저에 노출되지 않습니다.
#
# 토큰이 없으면 빈 목록을 쓰고 정상 종료합니다. 로컬 빌드나 토큰 설정 전에도
# 빌드가 깨지지 않아야 하기 때문입니다.

require 'net/http'
require 'json'
require 'uri'
require 'date'
require 'yaml'

SITE  = ENV.fetch('GOATCOUNTER_SITE', 'namhyo')
TOKEN = ENV['GOATCOUNTER_TOKEN'].to_s.strip
DAYS  = Integer(ENV.fetch('GOATCOUNTER_DAYS', '365'))
TOP_N = Integer(ENV.fetch('GOATCOUNTER_TOP', '5'))
OUT   = File.expand_path('../_data/popular.yml', __dir__)

def write(entries, note)
  File.write(OUT, entries.to_yaml)
  warn "[popular] #{note} (#{entries.size}건) -> #{OUT}"
end

if TOKEN.empty?
  write([], 'GOATCOUNTER_TOKEN 없음, 건너뜀')
  exit 0
end

uri = URI("https://#{SITE}.goatcounter.com/api/v0/stats/hits")
uri.query = URI.encode_www_form(start: (Date.today - DAYS).to_s, limit: 200)

begin
  res = Net::HTTP.start(uri.host, uri.port, use_ssl: true, open_timeout: 15, read_timeout: 30) do |http|
    http.request(Net::HTTP::Get.new(uri, 'Authorization' => "Bearer #{TOKEN}"))
  end

  unless res.is_a?(Net::HTTPSuccess)
    # 실패 원인을 알 수 있게 본문 앞부분을 같이 남깁니다.
    body = res.body.to_s.gsub(/\s+/, ' ').strip[0, 200]
    write([], "API #{res.code} 응답, 건너뜀 | #{uri} | #{body}")
    exit 0
  end

  hits = JSON.parse(res.body).fetch('hits', [])
  entries = hits
    .map { |h| [h['path'].to_s, h['count'].to_i] }
    .reject { |path, _| path.empty? }
    # 글만 남깁니다. 목록·카테고리 페이지는 순위에 넣지 않습니다.
    .select { |path, _| path.start_with?('/posts/') }
    # 수집 초기에 슬래시 없이 기록된 경로가 섞여 있어 합쳐줍니다.
    .each_with_object(Hash.new(0)) { |(path, count), acc| acc[path.chomp('/') + '/'] += count }
    .sort_by { |_, count| -count }
    .first(TOP_N)
    .map { |path, count| { 'path' => path, 'count' => count } }

  write(entries, '조회수 상위 글 수집 완료')
rescue StandardError => e
  # 통계를 못 가져왔다고 배포가 막히면 안 됩니다.
  write([], "수집 실패(#{e.class}: #{e.message}), 건너뜀")
  exit 0
end
