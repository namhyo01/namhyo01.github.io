---
title: "티스토리에서 github.io로 (4) — 댓글, 조회수, 인기글 붙이기"
date: 2026-08-23 23:00:00 +0900
categories: ["블로그 만들기"]
tags: ["giscus", "GoatCounter", "GitHub Actions", "정적사이트"]
description: "서버가 없는 사이트에서 댓글을 받고 조회수를 세는 법. 그리고 모든 글의 조회수가 1로 보이던 이유."
---

[3편](/posts/blog-migration-3-pitfalls/)까지 오면서 사이트는 제대로 굴러가게 됐습니다.
그런데 티스토리에서 당연하던 것 두 가지가 없었습니다. **댓글과 조회수**입니다.

정적 사이트는 서버가 없습니다. HTML 파일을 그대로 내려줄 뿐이라, 댓글을 저장할 데도
방문 기록을 남길 데도 없습니다. 둘 다 바깥 서비스를 빌려와야 합니다.

> **이 시리즈**
>
> 1. [왜 옮겼고, 무엇을 골랐나](/posts/blog-migration-1-why-and-what/)
> 2. [글 84개를 옮기며 만든 변환기](/posts/blog-migration-2-converter/)
> 3. [배포하고 나서 만난 함정들](/posts/blog-migration-3-pitfalls/)
> 4. **댓글 · 조회수 · 인기글 붙이기** ← 지금 글
{: .prompt-info }

## 댓글 — giscus

[giscus](https://giscus.app)는 **GitHub Discussions**를 댓글 저장소로 씁니다.
글 하나가 Discussion 하나가 되고, 방문자는 GitHub 계정으로 댓글을 남깁니다.

고른 이유는 단순합니다. **댓글이 내 저장소에 남습니다.** 글을 마크다운으로
가져온 것과 같은 이유입니다. 서비스가 사라져도 데이터는 GitHub에 있습니다.

설정은 `_config.yml`에 값 몇 개를 넣으면 끝입니다.

```yaml
comments:
  provider: giscus
  giscus:
    repo: username/username.github.io
    repo_id: MDEwOlJlcG9zaXRvcnkyODcwMjc3MTI=
    category: Announcements
    category_id: DIC_kwDOERuyAM4DD4Fm
    mapping: pathname     # 글 URL 하나당 Discussion 하나
    strict: '1'
    lang: ko
```

`repo_id`와 `category_id`는 GraphQL로 바로 뽑을 수 있습니다.

```bash
gh api graphql -f query='
{
  repository(owner: "username", name: "username.github.io") {
    id
    discussionCategories(first: 10) { nodes { id name } }
  }
}'
```

### 함정 1 — 앱을 설치해야 동작한다

설정을 다 넣고 배포했는데 글 하단에 이게 떴습니다.

```
오류 발생: giscus is not installed on this repository
```

giscus는 **GitHub App**입니다. [github.com/apps/giscus](https://github.com/apps/giscus)에서
저장소에 설치해야 댓글이 저장됩니다. 설정만으로는 안 됩니다.

### 함정 2 — URL을 바꾸면 댓글이 끊긴다

`mapping: pathname`은 **글의 URL로 Discussion을 찾습니다.**
파일명 slug를 바꾸면 그 글은 다른 Discussion을 보게 되고, 달렸던 댓글은
연결이 끊깁니다.

옮겨온 글 84개의 slug를 정하면서 이걸 미리 알았더라면 좀 더 신중했을 겁니다.
지금은 댓글이 없어서 다행이지만, 나중에 URL을 고칠 일이 생기면
**Discussion 제목도 같이 고쳐야** 합니다.

## 조회수 — GoatCounter

[GoatCounter](https://www.goatcounter.com)를 골랐습니다. 개인 블로그는 무료고,
쿠키를 쓰지 않으며, 무엇보다 **글마다 조회수를 표시하는 기능**이 있습니다.
Chirpy가 이걸 기본 지원합니다.

```yaml
analytics:
  goatcounter:
    id: mysite
pageviews:
  provider: goatcounter
```

### 함정 3 — 모든 글의 조회수가 1

배포하고 보니 **모든 글이 조회수 1**이었습니다. 방금 쓴 글도 1, 3년 된 글도 1.

수집은 정상이었습니다. 브라우저 네트워크 탭에서 `POST /count`가 200을 받고 있었습니다.
문제는 **표시**였습니다.

```
GET https://mysite.goatcounter.com/counter/%2Fposts%2Fmy-post.json
→ 403: Need to enable the 'allow using the visitor counter' setting
```

GoatCounter는 **수집과 표시를 따로 관리**합니다.

| | 설정 필요? |
| --- | --- |
| 수집 (`POST /count`) | 없음. 스크립트만 넣으면 바로 |
| 표시 (`GET /counter/<path>.json`) | **Site settings에서 켜야 함. 기본 꺼짐** |

그리고 Chirpy는 이 요청이 실패하면 조용히 **`1`을 표시**합니다.

```javascript
fetch(url).then(r => r.json()).then(data => { pv.innerText = data.count })
          .catch(() => { pv.innerText = '1' })   // ← 여기
```

그래서 "모든 글이 조회수 1"이라는, 원인을 짐작하기 어려운 증상이 나옵니다.
**Site settings → "Allow adding visitor counts on your website"** 를 켜면 해결됩니다.

### 함정 4 — 켰는데도 안 늘어난다

설정을 켜고 나서도 본인이 아무리 새로고침해도 숫자가 그대로였습니다.
이건 두 가지가 겹친 것이었습니다.

**8시간 세션.** GoatCounter는 페이지뷰가 아니라 **방문**을 셉니다.
`사이트 + User-Agent + IP`로 세션을 만들고 8시간 유지하는데, 그 안에 같은 글을
다시 열면 새 방문으로 치지 않습니다. 본인이 새로고침해봐야 안 늘어납니다.

**4시간 캐시.** 표시용 응답이 캐시됩니다. 응답 헤더를 재보니 정확히 4시간이었습니다.

```
date:    Fri, 21 Aug 2026 16:33:04 GMT
expires: Fri, 21 Aug 2026 20:33:04 GMT   → TTL 4.0시간
```

캐시 우회 쿼리를 붙여도, `Cache-Control: no-cache`를 보내도 똑같이 옛 값이 나옵니다.
**서버 쪽 캐시**라서 그렇습니다. 방금 기록한 새 경로를 바로 조회해도 `0`이 나옵니다.

정상 동작인지 확인하려면 글에 붙은 숫자가 아니라 **대시보드**를 봐야 합니다.
거기는 실시간입니다.

## 인기글 패널 — 순위는 어떻게 매기나

우측 패널에 "조회수 많은 글"을 넣고 싶었습니다. 여기서 막혔습니다.

사이트에 붙어 있는 `/counter/<path>.json`은 **경로 하나의 숫자만** 알려줍니다.
순위를 내려면 전체 집계가 필요한데,

- 글 87개를 브라우저에서 각각 부르는 건 말이 안 되고
- 순위용 API(`/api/v0/stats/hits`)는 **토큰이 필요**합니다

토큰을 브라우저에 넣을 수는 없습니다. 그래서 방향을 바꿨습니다.

### 빌드 시점에 집계해서 구워 넣기

방문자가 아니라 **빌드가** 한 번 집계하게 했습니다.

```ruby
# tools/fetch-popular.rb
uri = URI("https://#{SITE}.goatcounter.com/api/v0/stats/hits")
uri.query = URI.encode_www_form(start: (Date.today - 365).to_s, limit: 200)

res = Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
  http.request(Net::HTTP::Get.new(uri, 'Authorization' => "Bearer #{TOKEN}"))
end

entries = JSON.parse(res.body)['hits']
  .select { |h| h['path'].start_with?('/posts/') }
  .sort_by { |h| -h['count'] }
  .first(5)
```

결과를 `_data/popular.yml`로 저장하면 Jekyll이 그걸 읽어 패널을 그립니다.

- 토큰은 **GitHub Secret**에 있고 브라우저에 나가지 않습니다
- 방문자는 추가 요청을 하지 않습니다
- 워크플로에 `cron`을 걸어 하루 한 번 갱신합니다

### 통계 때문에 배포가 막히면 안 된다

이 부분은 처음부터 신경 썼습니다. 조회수는 **있으면 좋은 것**이지 배포를 막을
이유가 아닙니다.

```ruby
if TOKEN.empty?
  write([], 'GOATCOUNTER_TOKEN 없음, 건너뜀')
  exit 0        # 실패가 아니라 정상 종료
end
```

토큰이 없거나 API가 죽어도 빈 목록을 쓰고 넘어갑니다. 목록이 비면 패널은
아예 렌더링되지 않습니다. 사이트는 그대로 배포됩니다.

### 함정 5 — 시크릿이 등록됐는데 값이 비어 있었다

`gh secret set`으로 토큰을 넣었습니다. `gh secret list`에도 보였습니다.
그런데 빌드 로그는 계속 이랬습니다.

```
[popular] GOATCOUNTER_TOKEN 없음, 건너뜀 (0건)
```

`gh secret set`은 값을 물어보는 **대화형 프롬프트**를 띄웁니다. 터미널이 붙지 않는
환경에서 실행하면 프롬프트가 뜨지 않고 **빈 값이 그대로 저장**됩니다.
출력이 하나도 없었던 게 신호였는데 놓쳤습니다.

웹 UI에서 다시 넣으니 바로 됐습니다. 시크릿은 웹으로 넣는 편이 확실합니다.

### 패널을 어디에 끼우나

Chirpy의 우측 패널은 레이아웃에서 이렇게 조립됩니다.

```liquid
<div class="access">
  {% raw %}{% include_cached update-list.html lang=lang %}
  {% include_cached trending-tags.html lang=lang %}{% endraw %}
</div>
```

"최근 업데이트"와 "인기 태그" **사이에** 끼울 훅이 없습니다.
레이아웃 파일을 통째로 덮어쓸 수도 있었지만, 그러면 테마를 올릴 때마다
큰 파일을 원본과 다시 맞춰야 합니다.

대신 `update-list.html`을 덮어쓰고 **끝에 한 줄만** 덧붙였습니다.

```liquid
{% raw %}{% include popular-posts.html %}{% endraw %}
```

유지보수 면적이 훨씬 작습니다. 테마를 올릴 때 확인할 파일이 하나 줄어듭니다.

## 시리즈를 마치며

네 편에 걸쳐 티스토리에서 `github.io`로 옮긴 과정을 적었습니다.

| 편 | 내용 |
| --- | --- |
| [1](/posts/blog-migration-1-why-and-what/) | 마크다운으로 쓰고 싶어서 옮겼고, 기존 글을 손 덜 대고 올릴 수 있는 Chirpy를 골랐습니다 |
| [2](/posts/blog-migration-2-converter/) | 만료되는 이미지를 먼저 받고, 변환기를 만들고, 문장 단위로 검증했습니다 |
| [3](/posts/blog-migration-3-pitfalls/) | 증상과 원인이 먼 함정 다섯 가지를 만났습니다 |
| 4 | 서버 없이 댓글과 조회수를 붙였고, 순위는 빌드 시점에 구웠습니다 |

돌아보면 **글을 옮기는 것 자체는 하루면 됐습니다.** 나머지 시간은 전부
"분명히 했는데 왜 안 되지"를 파는 데 썼습니다. 그리고 그 원인들은 대부분
문서에 안 적혀 있거나, 적혀 있어도 증상과 연결되지 않는 것들이었습니다.

그래서 고칠 때마다 저장소의 `CLAUDE.md`에 **증상 · 원인 · 확인 명령**을 남겼습니다.
이 시리즈도 결국 같은 목적입니다. 몇 달 뒤의 저와, 같은 길을 가는 분을 위한 기록입니다.
