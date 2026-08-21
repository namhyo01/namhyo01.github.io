---
title: "JS 동작원리"
date: 2022-12-25 02:45:18 +0900
categories: ["Backend", "node.js"]
tags: ["node.js"]
description: "이 글은 이 사이트에서 많은 배움을 얻어 정리해서 작성한 글입니다."
tistory_id: 6
---
이 글은 [이 사이트에서](https://medium.com/@vdongbin/javascript-%EC%9E%91%EB%8F%99%EC%9B%90%EB%A6%AC-single-thread-event-loop-asynchronous-e47e07b24d1c) 많은 배움을 얻어 정리해서 작성한 글입니다.

## 주저리 주저리

다들 아시다시피 JS는 **싱글 스레드**이다.

이것이 의미하는 바는 한번에 딱 하나의 일만을 수행한다는 것이다.

그러나 JS가 Express, NestJS같은 서버에도 사용되는 언어라는 사실이 놀랍지 않은가?

그 이유는 **비동기, 동시성, 논블로킹 I/O** 같은 개념들을 이해하면 이해가 된다.

자 그러면 싱글 스레드가 어떻게 동시성을 가질 수 있는지에 대해 정리를 해보자

## JS는 어떻게 돌아가는가?

![image](/assets/img/posts/js-engine-internals-1.png)

JS의 런타임은 메모리 힙과 콜 스택으로 구성되어 있다.

> 메모리 힙 : 메모리 할당  
> 콜 스택 : 코드가 호출되면 스택으로 쌓이는 곳

#### 콜스택?

스레드에서 호출되는 함수들이 이 콜스택에 차곡차곡 쌓이고, 스택이니 LIFO 형태로 실행이 된다.

그런데 JS는 싱글 스레드이므로 콜스택 또한 하나밖에 없을 것이다.

ex)

```javascript
const foo = () => {
  bar()
  console.log('foo')
}
const bar = () => {
  console.log('bar')
}
foo();
console.log('foo and bar')
```

의 실행 결과는?

당연하게도

```
bar
foo
foo and bar
```

이렇게 순서대로 나올 것이다.

#### JS 런타임은 자체적으로 비동기를 지원하는가?

저는 이전까지는 당연히 지원하겠지~ 라는 생각을 가졌었습니다.

그러나 이것이 아니라는 사실을 위 블로그 글을 보다가 알게 되었다.

**동시성을 보장하는 비동기, 논블로킹 작업들은 JS 엔진을 구동하는 런타임 환경에서 담당한다고 한다. 대표적인 예시가 브라우저나 Node.js**

JS 엔진 자체는 on-demand 실행 환경일 뿐이라고 한다.

각 이벤트를 스케쥴링 하는 것이 그것을 둘러싼 환경이며, 비동기 작업도 이런 환경에서 지원한다고 한다.

![image](/assets/img/posts/js-engine-internals-2.png)

그림을 보니 더 자세히 이해가 갔었는데, 이게 JS엔진과 외부 런타임 환경이 합쳐진 모습이라 한다.

```
Event Loop : 이벤트 발생 시 호출되는 콜백 함수들을 관리해, callback queue에 전달하고, 
callback queue에 담긴 콜백 함수들을 콜 스택에 넘겨준다
* 이벤트 루프가 callback queue에서 콜스택으로 콜백 함수를 넘겨주는 작업은 
  콜스택에 쌓여있는 함수가 없을때만 수행됩니다.
Callback Queue(task queue): web api에서 비동기 작업들이 실행된 후 호출되는 콜백함수들이 기다리
는 공간입니다. 
이벤트 루프가 정해준 순서대로 줄을 서있으며, FIFO(First In First Out) 방식을 따릅니다.
* callback queue는 하나의 큐로 이루어있지 않습니다. 
    Microtask Queue, Animation Frames 등 여러개의 큐로 이루어져 있습니다.

Web api: Web api는 브라우저에서 자체 지원하는 api입니다.
Web api는 Dom 이벤트, Ajax (XmlHttpRequest), setTimeout 등의 비동기 작업들을 수행할 수 있도록 
api를 지원합니다.
```

### 브라우저 환경

지금 여기는 브라우저라고 가정해보자

JS 코드들이 실행 될 시, Web api가 지원하는 비동기 작업을 수행하는 코드가 실행된다고 가정하자.

비동기가 들어가면 이렇게 실행 될 것이다

1. 코드는 호출스택에 쌓인후 실행되면, JS엔진은 비동기 작업을 Web api에 위임!
2. Web api는 해당 비동기 작업을 수행하고, 콜백 함수를 이벤트 루프를 통해 callback queue에 넘겨주게 된다.
3. 그럼 이벤트 루프는 콜스택에 쌓인 함수가 없을 때, callback queue에서 대기하고 있는 콜백 함수를 콜 스택으로 넘겨준다
4. 콜 스택에 쌓인 콜백함수가 실행되고, 콜 스택에서 제거된다

이것이 **논블로킹 I/O**의 개념이다.

만약 http 요청의 작업을 동기로 수행한다면 그 함수는 콜 스택에 있을 것이고, 당연히 이 작업이 끝날 동안은 아~무런 작업도 하지 않을 것이다. (**블로킹**)

**그러나 JS는 비동기 작업을 Web api에 위임을 해서 해당 작업이 끝날 때 까지 다른 코드들을 수행 가능하게 된다**.

대표적 예시를 보자

```javascript
console.log('첫번째로 실행됩니다.');
setTimeout(() => console.log('최소 1초 후에 실행됩니다.'), 1000);
console.log('언제 실행될까요?');
```

출력은 어떻게 될까?

```
첫번째로 실행됩니다
언제 실행될까요?
최소 1초후에 실행됩니다.
```

1. console.log(’첫번째로 실행됩니다.’) ⇒ 이게 콜 스택에 쌓이고, 바로 실행된 후 제거가 된다
2. setTimeout이 콜 스택에 쌓이고, 실행되고, Web api에 timer가 생성되면서 위임을 한다
3. console.log(’언제 실행될까요?’)가 콜 스택에 쌓이고, 바로 실행되서 제거가 된다
4. Web api에서 생성된 timer가 1초 후에 callback queue로 콜백함수를 전달한다
5. callback qeueue에 전달되었던 setTimeout의 콜백함수가 콜 스택이 빈 것을 확인하고, 콜스택에 호출되어 실행된다

만약 setTimeout을 0이라고 두면?

그래도 결과는 바뀌지 않는다

왜냐 setTimeout은 web api가 지원하는 비동기 함수라는 것이다.

즉 콜백함수가 바로 콜스택에 쌓이는 것이 아닌 web api에서 비동기 처리를 한 후, 콜백함수가 callback queue에 전달되는 것이다.

그래서 결과는 바뀌지 않는다.

자 그럼 이 delay가 완벽할까? 당연히 아니다. setTimeout의 콜백함수가 callback queue에 쌓이더라도 FIFO형태이고, 콜 스택이 비지 않는다면 당연히 지연될 것이다.

## 참고자료

<https://medium.com/@vdongbin/javascript-%EC%9E%91%EB%8F%99%EC%9B%90%EB%A6%AC-single-thread-event-loop-asynchronous-e47e07b24d1c>
