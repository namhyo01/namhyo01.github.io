---
title: '[Flutter] flutter_native_splash 적용 안된 이유'
description: 'flutternativesplash를 이용해서 splash화면을 만들던 도 중, 테스트를 위해 실행을 시켰으나 빈 화면만이 계속해서 출력 되는 이슈가 있었다...'
pubDate: 2024-07-14
category: 'Flutter'
tistoryId: 85
---
## 문제 상황

flutter\_native\_splash를 이용해서 splash화면을 만들던 도 중, 테스트를 위해 실행을 시켰으나 빈 화면만이 계속해서 출력 되는 이슈가 있었다...

### 원인 및 해결

패키지 설명을 잘 읽었어야 했다.

native\_splash 화면을 만들었으면 생성을 터미널에서 입력을 해주어야만 했다

```bash
flutter pub run flutter_native_splash:create
```

위 처럼 입력을 해주고 재 실행을 해주니 잘 적용이 되는 것을 확인 가능하였다

-> 그래도 안 뜬다면 나의 오류지 뭐...
