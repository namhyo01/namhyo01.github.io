# 이 저장소에서 작업할 때

Jekyll + Chirpy 테마 기반 개인 블로그 겸 포트폴리오. 티스토리에서 옮겨온 글 84개가 들어 있습니다.

## 반드시 지킬 것

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
배포 워크플로가 `htmlproofer`로 내부 링크를 검사하므로, **링크가 깨지면 배포가 실패합니다**.
push 전에 같은 검사를 돌려보는 편이 안전합니다.

## 배포

`main`에 push → `.github/workflows/pages-deploy.yml`이 빌드·검사 후 GitHub Pages에 배포.

## 이전 이력

- `archive/jekyll-2020` — 2020년에 쓰던 첫 Jekyll 블로그
- `archive/astro` — 이 사이트를 Astro로 만들었던 버전. 티스토리 → 마크다운 변환 결과가 들어 있습니다.
