# namhyo01.github.io

[Astro](https://astro.build)로 만든 개인 블로그 겸 포트폴리오. `main`에 push하면 GitHub Actions가 빌드해서 GitHub Pages로 배포합니다.

- 사이트: https://namhyo01.github.io
- RSS: https://namhyo01.github.io/rss.xml

## 개발

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ 로 정적 빌드
npm run preview  # 빌드 결과 미리보기
```

## 글 쓰기

`src/content/blog/` 에 마크다운(`.md`) 또는 MDX(`.mdx`) 파일을 추가합니다. 파일 이름이 URL이 됩니다 (`hello-world.md` → `/blog/hello-world/`).

```yaml
---
title: '글 제목'
description: '목록·검색·SNS 카드에 노출되는 한 줄 요약'
pubDate: 2026-08-21
updatedDate: 2026-08-25   # 선택
tags: ['Astro', '회고']    # 선택
heroImage: '../../assets/some-image.jpg'  # 선택
draft: false              # true면 배포에서 제외
---
```

## 프로젝트 추가

`src/content/projects/` 에 마크다운을 추가합니다.

```yaml
---
title: '프로젝트 이름'
description: '한 줄 설명'
startDate: 2026-01-01
endDate: 2026-06-30       # 생략하면 "진행 중"으로 표시
stack: ['TypeScript', 'React']
role: '백엔드 개발'         # 선택
repo: 'https://github.com/...'   # 선택
demo: 'https://...'              # 선택
featured: true            # 홈과 목록 상단에 노출
order: 1                  # 작을수록 앞 (기본 999)
draft: false
---
```

`draft: true`인 글·프로젝트는 `npm run dev`에서는 보이지만 프로덕션 빌드에는 포함되지 않습니다.

## 구조

```
src/
├─ components/     BaseHead, Header, Footer, FormattedDate, TagList
├─ content/
│  ├─ blog/        글 (마크다운)
│  └─ projects/    포트폴리오 (마크다운)
├─ layouts/        BlogPost.astro, Project.astro
├─ lib/            collections.ts — 정렬·draft 필터
├─ pages/          라우트
├─ styles/         global.css
└─ content.config.ts   frontmatter 스키마 (Zod 검증)
```

## 배포 설정 (최초 1회)

GitHub 저장소 → **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 지정합니다.
