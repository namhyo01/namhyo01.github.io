---
title: "티스토리에서 github.io로 (3) — 배포하고 나서 만난 함정들"
date: 2026-08-23 22:35:00 +0900
categories: ["블로그 만들기"]
tags: ["Jekyll", "Chirpy", "GitHub Pages", "서비스워커", "디버깅"]
description: "배포했는데 화면이 안 바뀌고, false로 껐는데 켜져 있고, 글이 안 보이고, 잔디가 안 붙었습니다. 증상과 원인이 멀었던 다섯 가지."
---

앞선 두 편에서 [엔진을 고르고](/posts/blog-migration-1-why-and-what/)
[글 84개를 옮겼습니다](/posts/blog-migration-2-converter/).
배포도 됐고 링크 검사도 통과했습니다. 여기서 끝인 줄 알았습니다.

진짜는 그 다음이었습니다. 이번 글은 **증상만 봐서는 원인을 못 찾았던** 다섯 가지입니다.

> **이 시리즈**
>
> 1. [왜 옮겼고, 무엇을 골랐나](/posts/blog-migration-1-why-and-what/)
> 2. [글 84개를 옮기며 만든 변환기](/posts/blog-migration-2-converter/)
> 3. **배포하고 나서 만난 함정들** ← 지금 글
> 4. 댓글 · 조회수 · 인기글 붙이기
{: .prompt-info }

## 1. 배포했는데 화면이 안 바뀐다

사이드바를 고쳐서 배포했습니다. 빌드 성공, 배포 성공. 그런데 브라우저에는 예전 화면이
그대로였습니다.

`Ctrl+Shift+R`을 하면 바뀝니다. 그런데 **메뉴를 눌러 다른 페이지로 가면 다시 예전 화면**이
나왔습니다. 그리고 배포할 때마다 **"새 콘텐츠가 있습니다"** 팝업이 떴습니다.

범인은 Chirpy의 PWA 서비스 워커였습니다. 워커 설정을 열어보니 이렇습니다.

```javascript
const swconf = {
  cacheName: 'chirpy-1787317338',
  resources: [ '/assets/css/jekyll-theme-chirpy.css',
               '/', '/categories/', '/tags/', '/archives/', '/portfolio/', '/about/' ],
  purge: false
};
```

**탭 페이지 전부와 CSS를 캐시 우선으로 서빙**하고 있었습니다. 그래서

- 메뉴로 이동하면 캐시된 예전 페이지가 뜨고
- CSS도 예전 것이라 새로 넣은 효과가 하나도 안 보이고
- `cacheName`에 빌드 시각이 들어가니 **배포할 때마다** 새 워커가 생겨 팝업이 떴습니다

세 가지 증상이 전부 하나의 원인이었습니다.

> 브라우저 캐시를 지워도, `Cache-Control: no-cache`를 보내도 안 뚫립니다.
> 서비스 워커는 그보다 앞에서 요청을 가로챕니다. **완전히 새 브라우저 세션**으로
> 확인해야 진짜 배포 결과가 보입니다. 저는 이것 때문에 두 번 오진했습니다.
{: .prompt-warning }

## 2. `false`로 껐는데 안 꺼졌다

설정을 껐습니다.

```yaml
pwa:
  cache:
    enabled: false
```

그런데 서비스 워커가 계속 등록됐습니다. 테마 코드를 따라가보니 이랬습니다.

```html
<!-- head.html -->
<script defer src="/app.min.js?register={{ site.pwa.cache.enabled }}"></script>
```

`false`가 그대로 문자열로 들어가서 `register=false`가 됩니다. 그리고 받는 쪽은,

```javascript
const t = e.searchParams.get("register");
if (t) { /* 서비스 워커 등록 */ }
```

`t`는 문자열 `"false"`입니다. **자바스크립트에서 빈 문자열이 아닌 문자열은 참**입니다.
껐다고 생각한 설정이 오히려 확실하게 켜고 있었습니다.

해결은 값을 **비워두는** 것이었습니다.

```yaml
pwa:
  cache:
    enabled:        # 빈 값 → register= → falsy
```

### 그런데 이미 설치된 워커는 스스로 안 사라진다

여기서 한 번 더 막혔습니다. 새 등록을 막아도, **이미 워커를 설치한 방문자**는
그대로입니다. 워커 스크립트 자체는 내용이 안 바뀌니 브라우저가 갱신을 감지하지도
않습니다.

직접 지워주는 수밖에 없었습니다.

```javascript
navigator.serviceWorker.getRegistrations()
  .then(regs => regs.forEach(reg => reg.unregister()));
caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
```

실제로 동작하는지 확인하려고, 일부러 옛 워커를 설치한 뒤 다시 방문해봤습니다.
**워커 0개, 캐시 0개.** 그제서야 마음이 놓였습니다.

## 3. 인라인 스크립트가 통째로 죽는다

위 해제 스크립트를 넣고 배포했더니 콘솔에 이게 떴습니다.

```
Uncaught SyntaxError: Unexpected end of input
```

문법은 멀쩡했습니다. 빌드 결과물을 열어보고서야 알았습니다.

Jekyll 프로덕션 빌드는 **HTML을 한 줄로 압축**합니다. 그러면 이렇게 됩니다.

```javascript
// 원본
var mode = getMode();
// 지금 모드를 읽습니다
apply(mode);

// 압축 후 (한 줄)
var mode = getMode(); // 지금 모드를 읽습니다 apply(mode);
```

`//` 뒤가 **줄 끝까지 주석**이니, 줄이 하나면 나머지 코드가 전부 사라집니다.

인라인 스크립트에는 `/* */` 블록 주석만 씁니다. 이건 Chirpy만의 문제가 아니라
HTML을 압축하는 모든 정적 사이트 생성기에 해당합니다.

## 4. 글이 배포됐는데 안 보인다

프로젝트 글 두 개를 쓰고 배포했습니다. 빌드는 성공했는데 **글이 생성되지 않았습니다.**

```
internally linking to /posts/project-moheyum/, which does not exist
```

`front matter`를 보니,

```yaml
date: 2026-08-22 21:00:00 +0900
```

작업하던 시각이 **새벽 2시 반**이었습니다. 오후 9시는 아직 오지 않은 시각이라
Jekyll이 미래 글로 보고 건너뛴 겁니다.

날짜만 신경 쓰다 보면 시각을 놓칩니다. 예약 발행으로 쓸 수도 있는 동작이지만,
모르고 넣으면 "왜 배포됐는데 글이 없지" 하게 됩니다.

> 링크 검사(`htmlproofer`)를 배포 전에 돌리고 있어서 잡혔습니다.
> 안 돌렸으면 사이트에 깨진 링크를 올릴 뻔했습니다.
{: .prompt-tip }

## 5. 잔디가 안 붙는다

이틀 동안 스무 개 넘게 커밋했는데 GitHub 프로필 잔디가 그대로였습니다.

GitHub은 커밋의 **author 이메일이 계정에 등록된 주소와 일치할 때만** 그 커밋을
사용자에게 귀속시킵니다. 확인은 API로 됩니다.

```bash
gh api "repos/OWNER/REPO/commits?per_page=5" \
  --jq '.[] | "\(.sha[:7])  \(.author.login // "미귀속")  \(.commit.author.email)"'
```

결과가 이랬습니다.

```
e1c5401  미귀속    namhyo01@gmail.com          ← 이번 커밋들
0dbe254  namhyo01  34156840+namhyo01@users.noreply.github.com   ← 2020년 커밋
```

`author.login`이 비어 있으면 미귀속입니다. 예전 커밋은 GitHub noreply 주소를 써서
정상이었는데, 이번엔 등록 안 된 gmail로 커밋하고 있었습니다.

해결은 두 갈래입니다.

**앞으로의 커밋** — 저장소 git 설정을 계정에 등록된 주소로 바꿉니다.

```bash
git config user.email "12345678+username@users.noreply.github.com"
```

noreply 주소를 쓰면 이메일이 공개 커밋에 노출되지 않는다는 장점도 있습니다.

**이미 올라간 커밋** — [Settings → Emails](https://github.com/settings/emails)에서
그 주소를 계정에 추가하고 인증하면 **GitHub이 과거 커밋까지 소급해서 귀속**시킵니다.
히스토리를 다시 쓸 필요가 없습니다.

실제로 등록하자마자 21개가 전부 `login=namhyo01`로 바뀌었습니다.

> 히스토리를 재작성해서 강제 푸시하는 방법도 있지만 권하지 않습니다.
> 모든 커밋 해시가 바뀌고, **옛 커밋 객체는 GitHub 서버에 그대로 남습니다.**
{: .prompt-warning }

## 공통점

다섯 가지를 다시 보면 하나로 묶입니다. **증상과 원인이 멀었습니다.**

| 증상 | 실제 원인 |
| --- | --- |
| 화면이 안 바뀜 / 효과가 안 보임 / 팝업이 뜸 | 서비스 워커 캐시 (셋 다 같은 원인) |
| 설정을 껐는데 켜져 있음 | 문자열 `"false"`가 참 |
| 문법 멀쩡한데 SyntaxError | HTML 압축이 `//` 주석을 삼킴 |
| 빌드는 됐는데 글이 없음 | 시각이 미래 |
| 커밋했는데 잔디가 없음 | 이메일이 계정에 없음 |

그래서 고칠 때마다 **확인 명령을 같이 남겼습니다.** 저장소의 `CLAUDE.md`에
증상과 원인, 그리고 한 줄짜리 확인 방법을 적어뒀습니다.

```bash
# 서비스 워커가 살아 있나
curl -s https://example.github.io/ | grep -o 'app\.min\.js?[^"]*'
# → register= 이면 정상, register=false 면 켜져 있음

# 커밋이 나에게 귀속됐나
gh api "repos/OWNER/REPO/commits?per_page=5" --jq '.[] | .author.login'
```

몇 달 뒤에 같은 증상을 만나면 원인을 다시 찾을 자신이 없습니다. 그때 이 파일이
저를 구할 겁니다.

---

마지막 편에서는 **댓글과 조회수, 인기글 패널**을 붙인 이야기를 하겠습니다.
정적 사이트에는 서버가 없는데 어떻게 댓글을 받고, 조회수를 세고, 순위를 매기는지.
그리고 여기서도 "모든 글의 조회수가 1로 보이는" 함정이 하나 더 기다리고 있었습니다.
