---
title: '블로그를 시작합니다'
description: 'Astro와 GitHub Pages로 블로그 겸 포트폴리오를 만든 이유와, 앞으로 여기에 쓸 것들.'
pubDate: 2026-08-21
tags: ['회고', 'Astro']
---

첫 글입니다. 이 사이트는 두 가지 목적으로 만들었습니다.

1. **기록** — 개발하면서 막혔던 지점과 해결 과정을 남깁니다. 같은 문제를 다시 만났을 때 과거의 내가 도와주도록.
2. **정리** — 만든 것들을 [Projects](/projects)에 모아둡니다. 이력서 한 장에 담기지 않는 맥락을 여기에 씁니다.

## 글 쓰는 법

`src/content/blog/` 아래에 마크다운 파일을 하나 만들면 됩니다.

```markdown
---
title: '글 제목'
description: '목록과 검색 결과에 노출되는 한 줄 요약'
pubDate: 2026-08-21
tags: ['태그1', '태그2']
draft: false
---

여기부터 본문.
```

`draft: true`로 두면 로컬 개발 서버에서는 보이지만 배포된 사이트에는 나가지 않습니다. 쓰다 만 글을 안심하고 커밋할 수 있습니다.

## 배포

`main` 브랜치에 push하면 GitHub Actions가 빌드해서 GitHub Pages에 올립니다. 별도로 할 일은 없습니다.

```bash
git add .
git commit -m "post: 새 글"
git push
```
