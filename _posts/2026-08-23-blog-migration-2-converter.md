---
title: "티스토리에서 github.io로 (2) — 글 84개를 옮기며 만든 변환기"
date: 2026-08-23 22:30:00 +0900
categories: ["블로그 만들기"]
tags: ["Python", "마이그레이션", "Claude Code"]
description: "만료되는 이미지 URL, Go 코드에 붙은 angelscript, 제목 레벨 충돌. 티스토리 HTML을 마크다운으로 바꾸면서 실제로 만난 문제들."
---

[1편](/posts/blog-migration-1-why-and-what/)에서 Chirpy를 고른 이유를 적었습니다.
이번 글은 실제로 글 84개를 옮긴 이야기입니다.

> **이 시리즈**
>
> 1. [왜 옮겼고, 무엇을 골랐나](/posts/blog-migration-1-why-and-what/)
> 2. **글 84개를 옮기며 만든 변환기** ← 지금 글
> 3. [배포하고 나서 만난 함정들](/posts/blog-migration-3-pitfalls/)
> 4. [댓글 · 조회수 · 인기글 붙이기](/posts/blog-migration-4-comments-and-stats/)
{: .prompt-info }

## 먼저 글 목록부터

티스토리는 RSS를 제공합니다. 그런데 열어보니 **최근 10개만** 들어 있었습니다.

```
$ curl -s https://namhyo00.tistory.com/rss | grep -c "<item>"
10
```

전체 목록은 `sitemap.xml`에 있었습니다.

```
$ curl -s https://namhyo00.tistory.com/sitemap.xml | grep -oE '<loc>.*/[0-9]+</loc>' | wc -l
84
```

글 번호는 5번부터 89번까지, 중간에 23번 하나가 비어 있었습니다. 지운 글이겠죠.
이 84개를 0.7초 간격으로 받아왔습니다.

## 제일 급한 건 이미지였다

본문을 뜯어보니 이미지 주소가 이렇게 생겼습니다.

```
https://blog.kakaocdn.net/dna/bWAW0Z/btsOHBXQ4Pe/.../img.png
  ?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8
  &expires=1788188399
  &signature=tLoGOqW7NYa1v4BEX16PDiU5n0U%3D
```

`expires`가 붙어 있습니다. **서명된 임시 주소**입니다.

이 주소를 그대로 마크다운에 옮겨 적으면 당장은 잘 보입니다. 그리고 만료되는 순간
**글 전체의 이미지가 한꺼번에 깨집니다.** 그때는 원본이 어디 있었는지도 모르게 됩니다.

그래서 변환보다 다운로드를 먼저 했습니다. 84장 전부, 실패 0건.

이미지는 세 군데에 흩어져 있었습니다.

| 호스트 | 장수 | 성격 |
| --- | --- | --- |
| `blog.kakaocdn.net` | 53 | 서명 만료됨 |
| `user-images.githubusercontent.com` | 29 | 안정적 |
| `t1.daumcdn.net` | 2 | 티스토리 기본 이미지 |

확장자는 URL을 믿지 않고 **매직 넘버로 판별**했습니다. `.png`로 끝나는데 실제로는
GIF인 파일이 섞여 있었기 때문입니다.

```python
real = ('.png' if data[:8] == b'\x89PNG\r\n\x1a\n' else
        '.jpg' if data[:3] == b'\xff\xd8\xff' else
        '.gif' if data[:6] in (b'GIF87a', b'GIF89a') else
        '.webp' if data[:4] == b'RIFF' and data[8:12] == b'WEBP' else None)
```

## HTML을 마크다운으로

범용 변환 라이브러리를 쓸 수도 있었지만, 직접 만들었습니다. 티스토리가 쓰는 태그 집합이
좁아서(`p`, `h1~h4`, `pre`, `figure`, `ul`, `table` 정도) 통제하기 쉬웠고,
아래 나올 티스토리 고유의 문제들을 손볼 여지가 필요했습니다.

### 코드블록 언어가 엉터리였다

티스토리는 코드블록에 언어 클래스를 붙여줍니다. 전체를 세어보니 이랬습니다.

```
33 sql        21 python     10 angelscript   6 (없음)
 5 pgsql       4 css         4 java          4 vim
 4 go          2 routeros    2 coffeescript  2 scala
 2 reasonml    2 arduino     2 haxe          1 crystal
 1 vala        1 moonscript  1 llvm          1 crmsh
 1 stata       1 armasm      1 ada           ...
```

`angelscript`가 10개입니다. 열어보니 전부 **Go 코드**였습니다.
`reasonml`, `moonscript`, `crmsh`, `stata`, `vala`, `armasm`... 자동 감지가
만들어낸 값들입니다.

그대로 옮기면 엉뚱한 하이라이팅이 됩니다. 그래서 **믿을 수 있는 값만 쓰고,
나머지는 코드 내용으로 다시 추정**했습니다.

```python
tests = [
    ('go',     r'^\s*(package |func \(|func \w+\(.*\)\s*\w*\s*\{)|:=|\bfmt\.'
               r'|\btype \w+ (interface|struct)\s*\{|\b(float64|int64|uint64)\('),
    ('python', r'^\s*(def |class |import |from \w+ import)|\bprint\(|\bself\.'),
    ('java',   r'\b(public|private|protected)\s+(static\s+)?(class|void|int|String)\b'),
    ('sql',    r'(?is)^\s*(select|insert|update|delete|with|create table)\b'),
    ...
]
```

판정이 안 되면 **언어 없이** 둡니다. 틀린 하이라이팅보다 없는 편이 낫습니다.

### 제목이 글 제목과 충돌했다

본문에 `h1`이 섞여 있었습니다. 그런데 페이지에서 글 제목이 이미 `h1`입니다.
그대로 옮기면 한 페이지에 `h1`이 여러 개가 되고, 목차(TOC)도 이상해집니다.

글마다 **본문에서 가장 높은 제목이 `h2`가 되도록** 레벨을 밀었습니다.
상대적 계층은 그대로 두는 게 핵심입니다.

```python
levels = [int(m) for m in re.findall(r'<h([1-6])\b', src_html)]
hshift = (2 - min(levels)) if levels else 0
```

`h1 → h2 → h3` 이던 글은 `h2 → h3 → h4`가 되고,
원래 `h2`부터 시작하던 글은 손대지 않습니다.

### 문단 안 줄바꿈

티스토리는 문단 내부 줄바꿈을 `<br>`로 넣습니다. 이걸 문단 구분으로 바꿔버리면
글의 호흡이 완전히 달라집니다. 마크다운 강제 개행(줄 끝 공백 두 칸)으로 옮겼습니다.

### 그리고 원본에서 이미 깨져 있던 링크

[1편](/posts/blog-migration-1-why-and-what/)에서 말한 그 링크입니다.
`href` 속성 안에 마크다운 링크가 통째로 들어가 있었습니다. 변환기에서 잡아냈습니다.

```python
def clean_href(href):
    """'%5Bhttps://a%5D(https://a)' 또는 '[https://a](https://a)' -> 'https://a'"""
    m = re.fullmatch(r'(?:\[|%5B)(.*?)(?:\]|%5D)\((.*)\)', href.strip(), re.S | re.I)
    return m.group(2).strip() if m else href.strip()
```

84개 글 전체에서 이 패턴은 1건이었습니다.

## 제대로 옮겨졌는지 어떻게 확인하나

여기가 진짜 문제였습니다. 84개를 눈으로 다 볼 수는 없습니다.

그래서 **원문 HTML의 모든 문장을 줄 단위로 쪼개, 변환된 마크다운 안에 그 문장이
존재하는지** 하나씩 대조하는 스크립트를 만들었습니다. 이미지·코드블록·링크는 개수를 셌습니다.

첫 결과는 이랬습니다.

```
검사 84개 / 이상 없음 33개 / 차이 있음 51개
```

**51개.** 심장이 내려앉았습니다. 그런데 하나씩 들여다보니,

### 검증 코드가 두 번 틀렸다

**첫 번째.** 제목 개수가 안 맞는다고 나온 글들이 있었습니다.
한 글은 원문 3개인데 변환본이 29개였습니다.

원인은 제 정규식이었습니다.

```python
m_head = len(re.findall(r'(?m)^#{1,6} ', md))   # 코드블록 안까지 센다
```

**파이썬 코드블록의 `#` 주석**을 제목으로 세고 있었습니다.
알고리즘 풀이 글이 많으니 당연한 결과였고요.

**두 번째.** 문장이 통째로 없어졌다고 나온 글들이 있었습니다. 예를 들면 이런 줄입니다.

```
Thread_1 : |< — — A — →|
```

변환본에는 멀쩡히 있었습니다. 문제는 비교 방식이었습니다. 마크다운 쪽만
`<`, `>`를 지우고 원문 쪽은 남겨둬서, 두 문자열이 영원히 안 맞았습니다.

양쪽을 **똑같이** 정규화하고 다시 돌렸습니다.

```
전체 84개 검사
  문장이 온전히 옮겨진 글: 84개
  누락 의심 문장: 0건
```

이미지 84장, 코드블록 126개, 링크 81개 — 개수도 전부 일치했습니다.

> 처음 "51개 문제"라는 숫자를 그대로 믿고 손댔으면, 멀쩡한 글 51개를
> 고치고 있었을 겁니다. **검증 코드도 코드라서 틀립니다.**
> 이상한 결과가 나오면 대상보다 측정 도구를 먼저 의심하는 편이 빨랐습니다.
{: .prompt-warning }

## Claude Code는 어디까지 했나

변환기와 검증 스크립트는 [Claude Code](https://claude.com/claude-code)가 썼습니다.
언어 오탐 목록을 뽑고, 제목 레벨 시프트를 제안하고, 문장 단위 대조를 구현한 것도요.

위의 **검증 코드 버그 두 개도 Claude가 만들었고, Claude가 찾았습니다.**
"51개 이상"이라는 결과를 그대로 보고하는 대신 하나씩 열어보고
"측정이 틀렸다"고 스스로 정정했습니다.

제가 한 일은 방향을 정하고, 결과를 열어보고, 이상하면 말하는 것이었습니다.
그 판단까지 맡겼다면 결과가 달랐을 겁니다.

---

다음 글에서는 **배포하고 나서 만난 함정들**을 다루겠습니다.
"분명 배포했는데 화면이 안 바뀌는" 문제, 설정을 `false`로 했는데 켜져 있던 기능,
잔디가 안 붙던 이유 같은 것들입니다. 개인적으로는 이 시리즈에서 가장
쓸모 있는 편이 될 것 같습니다.
