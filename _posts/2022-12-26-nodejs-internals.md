---
title: "Node.js 동작 원리"
date: 2022-12-26 01:22:00 +0900
categories: ["Backend", "node.js"]
tags: ["node.js"]
description: "원래 JS는 브라우저 위에서만 작동이 가능했다."
tistory_id: 7
---
## Node.js 배경

원래 JS는 브라우저 위에서만 작동이 가능했다.

이게 싫어서 브라우저 말고도 다른 환경에서도 돌려보고자 노력을 하였지만 JS의 실행속도 때문에 사실상 불가능 했다고 한다.

그러나 구글이 **V8**엔진을 사용하면서 크롬을 공개하자, 180도 달라지기 시작하였다.

오픈소스에 엄청난 속도를 보여주는 V8엔진이 나오자마자 이 V8엔진을 기반으로하는 노드 프로젝트를 시작했다!

그래서 Node.js는 JS기반으로 만들어졌다.

JavaScript이름으로 유추하다 싶이 **스크립트 언어**이기에, 즉 특정한 프로그램 내에서 동작하는 프로그램이어서 Node나 브라우저 같은 프로그램이 필요로 하다.

그래서 저번 글에서 브라우저 기반을 설명을 드렸고, Node 기반을 이번에 설명할 것이다

> Node는 자체에 내장된 웹 서버가 존재한다. 그러나 어차피 서버 규모가 커지면 커질수록 nginx같은 것에 노드서버와 연결해야한다.

> Node.js는 비동기 이벤트 주도 JS 런타임으로서 확장성 있는 네트워크 애플리케이션을 만들 수 있게 설계되었다

### 사전 지식

#### 싱글 스레드 vs 멀티 스레드

**스레드**: 프로세스 내에서 할당받은 실행의 단위. 스레드는 프로세스 당 CPU의 코어 개수만큼 생성가능하다

**프로세스**: 현재 실행중인 프로그램이다. 즉 메모리에 올라와 실행되고 있다.

스레드 관련 공부를 하다보면 싱글 스레드와 멀티 스레드의 차이를 알게 된다.

간단하다 하나의 프로그램에서 스레드를 하나 밖에 못사용하느냐 아니면 여러개의 스레드를 사용이 가능하냐의 차이이다.

보통 당연히 멀티스레드가 당연히 항상 더 좋지 않을까라는 생각을 처음에 하게 된다.

당연하다 말 그대로 여러개의 팔로 동시에 작업을 진행하는데, 이게 성능이 더 뛰어나다는 생각을 하게 될 것이다.

**하지만** 효율적인가? 라는 측면은 조금 애매하다. 왜냐 스레드 풀에 스레드가 늘면 늘수록 이것을 관리하고 생성하고 지우는 CPU 자원이 소모가 되고, 만약 로드 밸런싱이 제대로 일어나지 않았다면 노는 스레드들이 많을 것이다.

게다가 만약 그냥 요청 개수가 적다면 로드 밸런싱 의미도 없이 그냥 노는 스레드들이 생겨버린다

## Node.js 특징

### Non Blocking I/O, Async

Node.js는 **싱글 스레드, 논블로킹모델이다.**

하나의 스레드 but 비동기 I/O로 요청들이 서로 블로킹 하지는 않는다.

**즉 동시에 많은 요청을 비동기로 수행을 해서 싱글 스레드여도 논블로킹이 된다**

게다가 **클러스터링**을 통해 프로세스를 fork해서 필요하면 늘리는 식으로 scale up이 가능하다

그래서 서버의 확장성이 용이하다는 장점이 있다.

#### Node.js가 완전한 싱글스레드인가?

Node는 싱글 스레드이다. 왜냐 JS를 실행하는 스레드는 오직 메인 스레드 하나이기 때문이다.

하지만 완전한 싱글스레드로 동작하지는 않는다

일부 Blocking작업들이 libuv의 스레드 풀에서 수행되기 때문이다.

관련된 자세한 내용은 밑에서…계속

### Event driven(이벤트 기반)

Node.js의 가장 큰 특징 중 하나는 이벤트 기반이란 것이다.

이벤트 기반은 이벤트가 발생시 미리 지정된 작업을 수행하는 방식인 것이다.

이것이 이벤트 리스너에서 등록한 콜백함수를 실행하는 방식으로 실행된다.

```javascript
router.get('/', (req,res,next)=> {
  // router.get 이벤트에 대한 콜백함수 로직
}
```

대표적으로 Express에서 사용하는 router도 이벤트 기반으로 동작한다.

#### 이벤트 루프

이렇게 이벤트 기반에서 콜백함수를 실행할려면 이를 관리하는 애가 필요로 할 것이다.

그것이 바로 **이벤트 루프**이다.

일단 Node.js와 브라우저의 이벤트 루프는 서로 다르다.

그것은 이 내부구조만 봐도 이해가 갈것이다.

![Untitled](/assets/img/posts/nodejs-internals-1.png)

```
  (그림은 [이 사이트](https://medium.com/@vdongbin/node-js-%EB%8F%99%EC%9E%91%EC%9B%90%EB%A6%AC-single-thread-event-driven-non-blocking-i-o-event-loop-ce97e58a8e21) 참고)
```

```
* Node.js는 Javascript와 C++언어로 구성되어 있습니다. 
V8엔진도 70% 이상의 C++로 구성되어 있으며, libuv는 100%의 C++언어로 구성된 라이브러리 입니다.
하지만 우리는 C/C++언어를 몰라도  Node.js는 사용할 수 있습니다. 
이는 V8 엔진에서 Javascript를 C++로 Translate 해주기 때문에 가능한 일입니다. 
또한 Node.js의 코어 라이브러리는 process.binding()을 통해 Javascript 환경에서 사용될 
수 있습니다. 
예를 들어 Node.js의 내장 모듈인 crypto는 원래 C++ 언어로 작성되어 있습니다.
* Node.js에 동작하는 이벤트 루프는 libuv 내에서 구현됩니다. 
이벤트 루프가 libuv 내에서 실행된다고 해서, Javascript의 스레드와 이벤트 루프의 스레드가 
별도로 존재한다고 생각하실 수 있습니다. 
하지만 Node.js는 싱글스레드이기 때문에 하나의 이벤트 루프를 갖으며, 
하나의 스레드가 모든 것을 처리합니다.
```

Node.js를 보면 내장 라이브러리와 v8엔진, libuv로 이루어져 있다.

Node.js의 이벤트 기반, 논블로킹 I/O는 전부 libuv 라이브러리에서 구현이 된다

Node.js에서 작성되는 코드들이 대부분 콜백함수로 이루어져 있는데(if도)

이런 콜백 함수들은 libuv내에 위치한 이벤트 루프에서 관리 및 처리가 된다

이벤트 루프는 **여러 개의 페이즈(Phase)들을 갖고 있으며, 해당 페이즈들은 각자만의 큐(Queue)를 갖는다.**  
이벤트 루프는 **라운드 로빈(round-robin) 방식**으로 노드 프로세스가 종료될때까지 **일정 규칙에 따라 여러개의 페이즈들을 계속 순회한다**.

페이즈들은 각각의 큐들을 관리하고, 해당 큐들은 FIFO(First In First Out) 순서로 콜백함수들을 처리한다.

#### Non-Blocking I/O

Node.js에서는 I/O작업인(http, CRUD, third party api, file)등의 블로킹 작업을 백그라운드에서 실행하고, 이를 비동기 콜백함수로 이벤트 루프에 전달하는 것이 논블로킹 I/O모델이라 할 수 있다.

백그라운드는 OS 커널 or libuv 스레드 풀을 의미한다

![image](/assets/img/posts/nodejs-internals-2.png)

I/O들은 OS 커널 or libuv 내의 스레드 풀에서 담당하는데, libuv는 OS 커널에서 어떤 비동기는 지원해주고 안하는지를 알기에, 커널 or 스레드 풀로 분기를 한다.

작업이 완료가 된다면 이벤트 루프에 그것을 알려주고, 그럼 이벤트 루프에 콜백 함수로 등록이 된다

스레드 풀은 커널이 지원을 안하는 작업들을 수행한다

이 libuv의 스레드 풀이 멀티 스레드이다! 대표적인 예시가 파일 시스템이다.

스레드 풀도 OS 커널처럼 작업이 다 끝나면 이벤트 루프에 콜백 함수를 전달한다.

#### 이벤트 루프 동작원리

![image](/assets/img/posts/nodejs-internals-3.png)

[출처](https://medium.com/@vdongbin/node-js-%EB%8F%99%EC%9E%91%EC%9B%90%EB%A6%AC-single-thread-event-driven-non-blocking-i-o-event-loop-ce97e58a8e21) Node.js 공식 홈페이지

> 각 단계는 실행할 콜백의 FIFO 큐를 가진다.  
> 각 단계는 자신만의 방법에 제한적이어서 보통 이벤트 루프가 해당 단계에 진입하면 해당 단계에 한정된 작업을 수행하고, 큐를 모두 소진하거나 콜백의 최대 개수를 실행할 때까지 해당 단계에서 콜백을 수행한다.  
> 큐를 모두 소진하거나 제한에 다하면 다음 단계로 이동한다  
> 이런 작업이 또 다른 작업을 스케줄링 하거나 poll단계에서 처리된 새 이벤트가 커널에 의해 큐에 추가될 수 있어서 폴링 이벤트를 처리하면서 폴 이벤트를 큐에 추가할 수 있다.  
> 그 결과 오래 실행된 콜백은 폴 단계가 타이머의 한계 시점보다 오래 실행되도록 할 수 있다.

Node.js를 실행시 스레드가 생기고, 이벤트 루프가 생성된다.  
이벤트 루프는 6개의 Phase를 가지고, 라운드 로빈 방식으로 순회한다

1. timers**타이머 함수의 입력된 지연시간은 콜백함수가 실행되는 정확한 값이 아니다.**
2. 그냥 적어도 이 지연시간 후에 작동된다라는 의미로 해석하자
3. setTimeout or setInterval 같은 timer함수가 처리된다.
   이벤트 루프가 페이즈를 순회하면서 타이머 단계에 오면 처리할 수 있는 타이머 함수들을 확인하고, 콜백 함수를 실행한다.
4. pending callbacksI/O작업이 오나료되면 다음번 루프에 이 단계로 들어오게 되고, I/O 작업 블록 내의 콜백함수들을 **poll단계의 큐에 넣는다**.
5. TCP 오류 같은 시스템 작업의 콜백도 실행한다.
6. **다음 루프 반복으로 연기된 I/O완료 결과**가 큐에 담긴다.
7. idle, prepare
8. 내부용으로만 사용해서 skip
9. polltimer 단계에서의 실행 시간 제어도 담당한다.만약 한도가 넘거나, 더이상 실행할 콜백함수가 없는 경우 별도의 규칙을 따라, 다음 단계로 넘어가거나 대기를 한다
  - check 단계에 setImmediate()가 있는지를 확인한다
  - 있다면 check단계로 간다
  - 없다면 timer에서 실행할 timer함수가 있는지 확인한다
  - timer함수를 실행할 수 있는 시간까지 대기한 후에, timer단계로 넘어간다. 대기하는 동안에 poll큐에 콜백함수가 쌓이면 바로 실행한다.
10. poll큐에 쌓인 콜백 함수들을 한도가 넘지 않을 떄까지 모두 동기적으로 실행한다.
11. I/O와 관련된 콜백(close 콜백, 타이머로 스케줄링된 콜백, setImmediate()를 제외한 거의 모든 콜백)을 실행한다.
12. check이벤트루프가 poll단계에서 작업을 한 후, idle상태가 되면 poll이벤트를 기달리지않고 바로 check로 간다
13. setImmedate()의 콜백함수가 실행된다
14. close callbacks
15. close 이벤트에 따른 콜백 함수를 실행한다. 대표적인 예시가 socker.on(’close’,…) 같은 이벤트에 따른 콜백함수이다.

ex)

```javascript
setTimeout(() => {
  console.log('timeout');
}, 0);

setImmediate(() => {
  console.log('immediate');
});
```

자 결과는?

정답이 없다.

왜냐하면 저 코드블락을 실행할 때, 이벤트 루프가 timer단계라면 setTimeout이 실행될 것이고, 이미 그 단계를 지났다면 setImmedate가 실행될 것이기 때문이다.

```javascript
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
```

그럼 이걸보자.

여긴 I/O 블락 내부인 것을 확인할 수 있다.

따라서 이 콜백은 poll단계에서 실행이 된다. poll은 check의 setImmediate가 있는지 확인하는데 있네?

그럼 setImmediate를 실행하고 그다음 setTimeout이 실행된다.

### 배우는 점

그래서 만약에 서버를 돌린다고 가정시, 이 이벤트 루프를 동기적으로 작성하게 된다면….?

아주 끔찍할 것이다.

그래서 가능하면 이벤트 루프를 block시키지 않게 코드를 작성하자

공식문서에서의 얘기를 따르면

- Encryption:
  - crypto.randomBytes (synchronous version)
  - crypto.randomFillSync
  - crypto.pbkdf2Sync
  - You should also be careful about providing large input to the encryption and decryption routines.
- Compression:
  - zlib.inflateSync
  - zlib.deflateSync
- File system:
  - Do not use the synchronous file system APIs. For example, if the file you access is in a [distributed file system](https://en.wikipedia.org/wiki/Clustered_file_system#Distributed_file_systems) like [NFS](https://en.wikipedia.org/wiki/Network_File_System), access times can vary widely.
- Child process:
  - child\_process.spawnSync
  - child\_process.execSync
  - child\_process.execFileSync

이거와 **JSON.parse(), JSON.stringfy()** 도 사용하지 말자고 한다. O(n)이지만 n이 커지기 쉽기때문이다.

대신 **JSONStream, Big-Friendly JSON**을 사용하자

```javascript
const fs = require("fs");

// 동기적
const data = fs.readFileSync("./data.txt", "utf-8");
console.log(data);

// 비동기적
const data2 = fs.readFile("./data.txt", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  }
  console.log(data);
});
```

그래서 이렇게 비동기적으로 짜자!

## Node.js 장점

가장 큰 장점으로는 생산성을 둘 수 있다. FE 개발 언어로 BE 까지도? 이거만큼 생산성을 올리는 작업이 있을까 싶다.  
**그리고 제일 중요한 장점으로는 socket.io가 있다.**  
웹 개발이 양방향이 요즘 trend인데, 클라이언트와 연결을 하고 push를 하는 기술이 필요한데, node.js는 그것에 특화되어 있다고 할 수 있다.  
**싱글 스레드 기반의 멀티 플렉싱으로 대용량 사용자에게 푸시 처리가 가능하다.**  
<-> WAS는 스레드 수만큼만 동시 connection처리를 하는데, node.js는 이런 대량 동시 connection 처리에 더 용이하다 할 수 있다.  
<-> (하지만 GO가 나온다면!?)  
그래서 이런 분야일시 더 효율적이다

- 입출력이 잦은 어플리캐이션
- 데이터 스트리밍 어플리케이션
- 데이터를 실시간 다루는 어플리케이션
- JSON API 기반 어플리케이션
- 싱글 페이지 어플리케이션
- SSR

## 전반적인 흐름

![image](/assets/img/posts/nodejs-internals-4.png)

출처 : <https://leejongchan.tistory.com/22>

## 참고사이트

[Node.js 동작원리 (Single thread, Event-driven, Non-Blocking I/O, Event loop)](https://medium.com/@vdongbin/node-js-%EB%8F%99%EC%9E%91%EC%9B%90%EB%A6%AC-single-thread-event-driven-non-blocking-i-o-event-loop-ce97e58a8e21)

[Row level Node : js의 동작 방식부터 libuv와 event loop까지](https://darrengwon.tistory.com/953)
