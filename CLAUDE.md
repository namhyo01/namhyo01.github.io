# 이 저장소에서 작업할 때

Jekyll + Chirpy 테마 기반 개인 블로그 겸 포트폴리오. 티스토리에서 옮겨온 글 84개가 들어 있습니다.

## 반드시 지킬 것

- **개인 상황을 글에 쓰지 않습니다.** 이 사이트는 공개돼 있고 포트폴리오로도 쓰입니다.
  이직/구직/퇴사, 재직 상태, 회사명, 면접·지원 현황, 연봉은 **본문·frontmatter·커밋
  메시지 어디에도** 넣지 않습니다. 글을 쓰게 된 동기를 설명해야 하면 개인 사정 대신
  기술적인 이유를 씁니다.

  > 커밋 메시지도 본문과 똑같이 공개됩니다. 2026-08-22 에 한 번 놓쳐서 히스토리를
  > 재작성하고 강제 푸시했는데, **옛 커밋 객체는 GitHub 서버에 남습니다**(SHA 를 알면
  > 접근됨). GitHub Support 에 GC 를 요청하는 것 말고는 되돌릴 방법이 없으니
  > 쓰기 전에 거릅니다.

- **사이트 문구는 한국어**로 씁니다. 파일명 slug와 코드 식별자는 영어.
- 글은 `_posts/YYYY-MM-DD-slug.md` 형식으로만 추가합니다. 날짜와 파일명이 어긋나면 Jekyll이 다른 날짜로 처리합니다.
- `categories`는 **최대 2단계**입니다 (Chirpy 제약). `["대분류", "소분류"]`.
- 이미지는 `assets/img/posts/` 에 두고 `/assets/img/posts/...` 절대 경로로 참조합니다.
  외부 이미지 URL을 그대로 쓰지 않습니다 — 티스토리 CDN 주소는 만료됩니다.
- 테마는 gem으로 들어옵니다. `_layouts`, `_sass` 등을 직접 만들면 테마 파일을 덮어쓰므로,
  꼭 필요할 때만 원본을 복사해서 수정합니다.

## 지금 덮어쓰고 있는 테마 파일

gem을 올릴 때(`Gemfile`의 `jekyll-theme-chirpy` 버전 변경) 아래 파일들은 **원본과 다시 맞춰야** 합니다.

| 파일 | 왜 덮어썼나 |
| --- | --- |
| `_includes/sidebar.html` | 테마 전환 버튼이 사이드바 맨 아래 구석에 아이콘만 있어 눈에 띄지 않았습니다. 프로필 바로 아래로 옮기고 '테마' 라벨을 붙였습니다. `dropup` → `dropdown`으로 바꿨고, 하단의 `.icon-border` 구분선은 제거했습니다. |
| `assets/css/jekyll-theme-chirpy.scss` | 테마 진입점 + 커스텀 스타일. 위쪽 `@use` 블록은 원본 그대로여야 합니다. |
| `_includes/metadata-hook.html` | 모바일 주소창 색을 실제 테마에 맞춥니다. 테마가 제공하는 확장 지점이라 업그레이드 영향은 없습니다. |

## 커스텀 스타일에서 조심할 것

- **테마 전환기를 `.sidebar-bottom` 밖으로 옮기면 테마의 드롭다운 스타일이 따라오지 않습니다.**
  해당 규칙이 `.sidebar-bottom #mode-toggle + .dropdown-menu` 로 걸려 있어서, 빼면 Bootstrap
  기본 파란 배경이 그대로 드러납니다. `assets/css/...scss` 의 `.theme-switch .dropdown-menu` 에
  같은 변수로 다시 정의해 뒀습니다.
- **등장 애니메이션의 `animation-fill-mode` 는 `backwards` 여야 합니다.** `both`/`forwards` 로 두면
  애니메이션이 끝난 뒤에도 `transform` 을 점유해서 `:hover` 변형이 먹지 않습니다.
- **hover 이동은 `padding` 대신 `transform` 으로** 합니다. 테마가 breakpoint마다 다른 padding
  기본값을 써서 어긋납니다.
- **아바타와 본문 이미지에는 hover 변형을 넣지 않습니다.** 테마에 이미 아바타 확대와
  본문 이미지 클릭 확대(`.popup`, `cursor: zoom-in`)가 있어 서로 덮어씁니다.
- **인라인 `<script>` 에는 `//` 줄 주석을 쓰지 않습니다.** 프로덕션 빌드가 HTML을 한 줄로
  압축해서 뒤따르는 코드가 전부 주석 처리됩니다. 블록 주석만 씁니다.

## 확인

Ruby가 로컬에 없습니다. Docker로 빌드하세요 (명령은 README.md 참고).

> **`docker run` 에 `-u "$(id -u):$(id -g)"` 를 빠뜨리지 마세요.** 빠뜨리면 `.jekyll-cache/`
> 안에 root 소유 파일이 생기고, 다음번 일반 사용자 빌드가 이렇게 죽습니다.
>
> ```
> jekyll/cache.rb:181:in 'File#initialize': Permission denied @ rb_sysopen
>   - /site/.jekyll-cache/Jekyll/Cache/...
> ```
>
> 복구는 root 로 캐시를 지우면 됩니다 (캐시라 지워도 안전합니다).
>
> ```bash
> docker run --rm -v "$PWD":/site -w /site ruby:3.4 rm -rf /site/.jekyll-cache
> ```
배포 워크플로가 `htmlproofer`로 내부 링크를 검사하므로, **링크가 깨지면 배포가 실패합니다**.
push 전에 같은 검사를 돌려보는 편이 안전합니다.

## 서비스 워커는 완전히 꺼둔 상태입니다

`_config.yml` 의 `pwa.cache.enabled` 는 **빈 값**입니다. `false` 라고 적으면 안 됩니다.
`_includes/head.html` 이 이렇게 렌더링하기 때문입니다.

```
app.min.js?register={{ site.pwa.cache.enabled }}
```

`false` 로 적으면 `register=false` 가 되는데, `app.min.js` 는 `if (param)` 로만 검사하므로
**문자열 "false" 가 참으로 평가되어 서비스 워커가 그대로 등록됩니다.** 빈 값이어야
`register=` 가 되어 등록 블록을 건너뜁니다.

`pwa.enabled` 는 `true` 로 둬야 합니다. `false` 로 하면 `notification.html` 이 빠지는데,
`register` 가 참이면 `app.min.js` 가 `document.getElementById('notification')` 의 결과에
`.querySelector()` 를 호출해 TypeError 가 납니다.

`_includes/metadata-hook.html` 에 기존 워커를 해제하는 스크립트가 있습니다. 워커
스크립트 자체는 내용이 바뀌지 않아 브라우저가 알아서 갱신하지 않기 때문에,
이미 설치된 방문자를 위해 직접 지워줘야 합니다. **지우지 마세요.**

서비스 워커를 켜두면 생기는 일: 배포해도 방문자에게 예전 화면이 계속 보이고,
'새 콘텐츠가 있습니다' 팝업이 매번 뜹니다.

## 댓글

giscus(GitHub Discussions) 를 씁니다. 댓글은 이 저장소의 Discussions
`Announcements` 카테고리에 쌓이고, `mapping: pathname` 이라 글 URL 하나당
Discussion 하나가 생깁니다. **글의 URL(파일명 slug)을 바꾸면 그 글에 달린 댓글과
연결이 끊깁니다.** 옮길 일이 있으면 Discussion 제목도 같이 고쳐야 합니다.

동작하려면 저장소에 giscus GitHub App 이 설치되어 있어야 합니다.

## 방문 통계 (GoatCounter)

`_config.yml` 의 `analytics.goatcounter.id: namhyo`, `pageviews.provider: goatcounter`.
대시보드는 https://namhyo.goatcounter.com 입니다.

**수집과 표시는 별개입니다.**

- 수집(`POST /count`)은 설정 없이 바로 됩니다.
- 글에 조회수를 **표시**하려면 GoatCounter 쪽 *Site settings* 에서
  **"Allow adding visitor counts on your website"** 를 켜야 합니다. 기본값이 꺼짐이라
  안 켜면 `GET /counter/<path>.json` 이 403 을 돌려주고, Chirpy 는 실패 시
  숫자를 **'1' 로 표시**합니다. 모든 글이 조회수 1로 보이면 이 설정을 의심하세요.
- 켠 뒤에도 카운터 응답은 최대 4시간 캐시됩니다.

확인 방법:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://namhyo.goatcounter.com/counter/%2Fposts%2Falb-vs-nlb.json"
# 200 이면 정상, 403 이면 위 설정이 꺼져 있음
```

## 커밋 계정

이 저장소는 `git config user.email` 이
**`34156840+namhyo01@users.noreply.github.com`** 로 설정돼 있습니다. **바꾸지 마세요.**

GitHub 은 커밋의 author 이메일이 계정에 등록된 주소와 일치할 때만 그 커밋을
사용자에게 귀속시키고 잔디에 반영합니다. `namhyo01@gmail.com` 은 계정에 등록돼
있지 않아서, 이 주소로 커밋하면 `author.login` 이 비고 기여도에 잡히지 않습니다.

확인 방법:

```bash
gh api "repos/namhyo01/namhyo01.github.io/commits?per_page=5" \
  --jq '.[] | "\(.sha[:7]) \(.author.login // "미귀속") \(.commit.author.email)"'
```

## 조회수 순위 패널

우측 패널의 '조회수 많은 글'은 `tools/fetch-popular.rb` 가 빌드 전에
GoatCounter API(`/api/v0/stats/hits`)를 호출해 `_data/popular.yml` 로 굽습니다.

- 토큰은 저장소 시크릿 **`GOATCOUNTER_TOKEN`** 입니다. 브라우저에 노출되지 않습니다.
- 토큰이 없거나 API 가 실패하면 **빈 목록을 쓰고 정상 종료**합니다. 통계 때문에
  배포가 막히면 안 됩니다. 목록이 비면 패널은 렌더링되지 않습니다.
- `_data/popular.yml` 은 빌드마다 덮어써지므로 `.gitignore` 에 있습니다.
  로컬 빌드가 깨지지 않도록 빈 파일만 강제로 커밋해 두었습니다.
- 패널은 `_includes/update-list.html` 끝에서 `popular-posts.html` 을 include 합니다.
  `.access` 블록이 update-list → trending-tags 순으로 조립되는데 그 사이에 훅이
  없어서입니다. `_layouts/default.html` 을 통째로 덮어쓰지 않으려고 택한 방법입니다.
- 범위와 개수는 환경변수로 조절합니다: `GOATCOUNTER_DAYS`(기본 365),
  `GOATCOUNTER_TOP`(기본 5).

## 배포

`main`에 push → `.github/workflows/pages-deploy.yml`이 빌드·검사 후 GitHub Pages에 배포.

매일 18:00 UTC(다음날 03:00 KST)에 cron 으로도 한 번 돕니다. 글을 쓰지 않아도
조회수 순위가 갱신되게 하기 위해서입니다. **GitHub 은 60일간 활동이 없는 저장소의
예약 워크플로를 자동으로 중지**하므로, 오래 손대지 않으면 Actions 탭에서 다시
켜야 할 수 있습니다.

배포 직후 브라우저에 이전 화면이 보이면 서비스 워커/HTTP 캐시 때문입니다.
`Ctrl+Shift+R` 로 확인하고, 자동화 검증은 새 브라우저 컨텍스트에서 하세요.

## 이전 이력

- `archive/jekyll-2020` — 2020년에 쓰던 첫 Jekyll 블로그
- `archive/astro` — 이 사이트를 Astro로 만들었던 버전. 티스토리 → 마크다운 변환 결과가 들어 있습니다.
