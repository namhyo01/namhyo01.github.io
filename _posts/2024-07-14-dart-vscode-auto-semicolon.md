---
title: "[Dart] vscode - 저장시 자동 세미 콜론 붙이기"
date: 2024-07-14 14:20:18 +0900
categories: ["Flutter"]
description: "dart는 무조건 문장 끝에 세미콜론을 붙여야만 한다"
tistory_id: 84
---
dart는 무조건 문장 끝에 세미콜론을 붙여야만 한다

우리가 직접 하기에는 귀찮으니 에디터의 힘을 빌려보자

설정에 들어가서 밑 처럼 코드를 추가해주자

그러면 이제 세미콜론을 저장할 때 마다 붙여준다

"editor.codeActionsOnSave"

: {

"quickfix.insertSemicolon"

:

true

},

참고로 무조건

"[dart]"

:

여기 안에다가 넣어주어야 한다

안 그러면... 다른 언어에도 적용이 된다
