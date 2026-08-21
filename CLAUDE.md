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

## 확인

Ruby가 로컬에 없습니다. Docker로 빌드하세요 (명령은 README.md 참고).
배포 워크플로가 `htmlproofer`로 내부 링크를 검사하므로, **링크가 깨지면 배포가 실패합니다**.
push 전에 같은 검사를 돌려보는 편이 안전합니다.

## 배포

`main`에 push → `.github/workflows/pages-deploy.yml`이 빌드·검사 후 GitHub Pages에 배포.

## 이전 이력

- `archive/jekyll-2020` — 2020년에 쓰던 첫 Jekyll 블로그
- `archive/astro` — 이 사이트를 Astro로 만들었던 버전. 티스토리 → 마크다운 변환 결과가 들어 있습니다.
