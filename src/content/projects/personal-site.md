---
title: '개인 블로그 & 포트폴리오'
description: 'Astro로 만든 정적 사이트. 마크다운으로 글을 쓰면 GitHub Actions가 빌드해서 GitHub Pages에 배포합니다.'
startDate: 2026-08-21
stack: ['Astro', 'TypeScript', 'GitHub Actions', 'GitHub Pages']
role: '기획 · 개발 · 운영'
repo: 'https://github.com/namhyo01/namhyo01.github.io'
demo: 'https://namhyo01.github.io'
featured: true
order: 1
---

## 왜 만들었나

글과 프로젝트를 한곳에 모아두기 위해 만들었습니다. 외부 블로그 플랫폼은 편하지만 프로젝트 페이지를 원하는 형태로 구성하기 어렵고, 콘텐츠가 내 저장소에 남지 않습니다.

## 구조

- **콘텐츠 컬렉션 2개** — `blog`(글)과 `projects`(포트폴리오)를 분리했습니다. 각각 다른 frontmatter 스키마를 갖고, Zod로 빌드 시점에 검증됩니다. 필수 필드를 빠뜨리면 배포 전에 빌드가 실패합니다.
- **draft 플래그** — 개발 서버에서는 보이고 프로덕션 빌드에서는 빠집니다. `src/lib/collections.ts`에서 `import.meta.env.DEV`로 분기합니다.
- **정적 출력** — 서버가 필요 없어 GitHub Pages 무료 호스팅으로 충분합니다.

## 앞으로

- 태그별 필터 페이지
- 다크 모드
- 글 내 목차(TOC)
