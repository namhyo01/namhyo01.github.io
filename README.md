# namhyo01.github.io

[Jekyll](https://jekyllrb.com/) + [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) 테마로 만든 개인 블로그 겸 포트폴리오.
`main`에 push하면 GitHub Actions가 빌드해서 GitHub Pages로 배포합니다.

- 사이트: https://namhyo01.github.io
- RSS: https://namhyo01.github.io/feed.xml
- 이전 블로그: https://namhyo00.tistory.com (글 84개를 이곳으로 옮겼습니다)

## 글 쓰기

`_posts/` 에 `YYYY-MM-DD-slug.md` 형식으로 파일을 추가합니다. 파일명의 slug가 URL이 됩니다
(`2025-06-19-go-random-thread-unsafe.md` → `/posts/go-random-thread-unsafe/`).

```yaml
---
title: "글 제목"
date: 2026-08-21 20:00:00 +0900
categories: ["대분류", "소분류"]   # 최대 2단계
tags: ["태그1", "태그2"]           # 소문자 권장
description: "목록·검색·SNS 카드에 노출되는 한 줄 요약"
---
```

- **이미지**는 `assets/img/posts/` 에 넣고 `![설명](/assets/img/posts/파일명.png)` 으로 참조합니다.
  바로 다음 줄에 `_캡션_` 을 쓰면 캡션으로 표시됩니다.
- **초안**은 `_drafts/` 에 두면 배포에 포함되지 않습니다.

## 로컬에서 확인

Ruby가 설치되어 있지 않아도 Docker로 돌릴 수 있습니다.

```bash
# 빌드
docker run --rm -v "$PWD":/site -w /site -u "$(id -u):$(id -g)" -e HOME=/tmp \
  -e BUNDLE_PATH=/tmp/vendor -e BUNDLE_APP_CONFIG=/tmp/.bundle ruby:3.4 \
  sh -c 'bundle install && JEKYLL_ENV=production bundle exec jekyll build'

# 미리보기 (http://127.0.0.1:4400)
python3 -m http.server 4400 --directory _site --bind 127.0.0.1
```

배포 워크플로는 빌드 후 `htmlproofer`로 내부 링크를 검사합니다. push 전에 같은 검사를 돌리려면:

```bash
docker run --rm -v "$PWD":/site -w /site -u "$(id -u):$(id -g)" -e HOME=/tmp \
  -e BUNDLE_PATH=/tmp/vendor -e BUNDLE_APP_CONFIG=/tmp/.bundle ruby:3.4 \
  sh -c 'bundle install && bundle exec htmlproofer _site --disable-external'
```

Ruby가 있다면 `bundle install && bundle exec jekyll s` 로 충분합니다.

## 구조

```
_config.yml            사이트 설정 (제목, 아바타, 언어, 소셜 링크)
_posts/                글
_tabs/                 사이드바 탭 (카테고리·태그·아카이브·포트폴리오·정보)
assets/img/posts/      글에 쓰이는 이미지
assets/img/avatar.jpg  사이드바 프로필 이미지
.github/workflows/     빌드 & 배포
```

테마 자체는 gem(`jekyll-theme-chirpy`)으로 들어옵니다. 레이아웃이나 스타일을 고치려면
[테마 저장소](https://github.com/cotes2020/jekyll-theme-chirpy)에서 해당 파일을 복사해 같은 경로에 두면 덮어씁니다.

## 배포 설정 (최초 1회)

GitHub 저장소 → **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 지정합니다.
