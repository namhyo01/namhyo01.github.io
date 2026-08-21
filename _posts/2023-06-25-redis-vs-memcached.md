---
title: "Redis vs Memcached"
date: 2023-06-25 16:27:32 +0900
categories: ["CS", "잡 지식"]
tags: ["잡 지식"]
description: "redis와 memcached는 유명한 비교 대상이라 한다."
tistory_id: 78
---
## 개요

redis와 memcached는 유명한 비교 대상이라 한다.

둘다 in-memory기반 DB이면서, 캐시의 목적으로 사용되기 때문이다.

그럼 이 둘 중 어떤 것을 사용하는 것이 좋을까?

실제로 저 같은 경우는 저번 프로젝트에 캐시의 용도로 redis를 사용하였는데, 과연 이게 memcached에 비해 옳은 선택이었는가 라는 고민이 된다.

일단 이 비교를 아주 잘한 블로그가 있어 이 것을 토대로 참고해 작성해 본다.

<https://luran.me/359>

Memcached vs. Redis - 특징 비교

개요 In-Memory Data Store 관점에서 Memcached냐 Redis냐를 두고 저울질 하는 광경을 종종 보곤한다. 이에 두 솔루션을 비교 정리해 놓는다. 주요 특징 비교 두 솔루션 모두 NoSQL로 분리되고, 크게는 In-Memor

luran.me

갓갓...

## 비교

![](/assets/img/posts/redis-vs-memcached-1.png)
_https://luran.me/359_

일단 위 표처럼 정리해 주셨다.

음 일단 간단하게 보면 redis에서는 다양한 데이터 구조가 지원되는 반면에 싱글 스레드 이다...

그리고 데이터 저장이 가능, replica가 가능, 트랜잭션 지원, pub/sub구조가 있음을 알 수 있었다.

일단 이것만 봐도 memcached에 비해 redis가 더 많은 것을 지원한다는 사실을 알 수 있었다.

반대로 memcached가 성능이 더 좋음에도 불구하고 redis를 사용하는지에 대한 이해가 조금 될 것 같기도 하다.

조금 자세히 알아보자

### 확장성

memcached는 scale up을 통해 확장을 하고,

redis는 scale out을 통해 확장을 한다.

scale up은 간단하게 말하자면 cpu 성능을 올리는 식으로 해서 기존보다 더 높은 성능을 만드는 것이다.(vertical)

반대로 scale out은 서버를 여러대로 늘리는 것이다. (horizontal)

redis는 싱글 스레드 이기에 사실 성능을 더 늘리는 것보단 redis를 여러개 만들어 처리하는 것이 더 좋다는 의미이고, memcached는 멀티 스레드 이기에 성능을 올려서 더 최적화를 시킨다는 의미인 듯 하다(replication도 안되네?)

### Data Eviction 전략

보통 캐시가 꽉차면 캐시 정책에 의해 새롭게 지우고, 추가한다. 대표적으로는 LRU가 있을 것이다.

redis와 memcached 에서도 LRU를 기본적으로 사용한다

하지만 redis는 더 다양한 정책을 선택 가능한 것에 비해 memcached는 LRU가 고정인 상태이다.

### 다양한 데이터 타입 지원

redis의 경우 memcached가 string type만 지원하는 것에 비해 list, set, hash, sorted set 등 다양한 데이터 타입도 지원을 한다.

### Persistence

Redis는 데이터를 저장이 가능하다.

RDB나 AOF 기반으로 데이터 저장이 가능하다.

그래서 redis는 데이터 스토어로도 가능하고, 캐시 용도로도 사용이 가능하다.

RDB의 경우에는, 저장에 오래걸리지만 AOF보다 로딩시간이 짧고, AOF는 RDB 스냅샷 방식보다 레코드 별 기록을 남기므로 데이터 양은 많아지나 데이터 손실이 없고, 복구하는데 스냅샷보다 오래걸린다.

### 트랜잭션 지원

Redis는 WATCH/ MULTI/ EXEC 등의 명령어를 기반으로 optimistic lock 기반 트랜잭션을 지원한다

### PUB/SUB

Redis는 Pub/Sub을 지원하는데, 이는 메시징 솔루션으로 메시지들을 큐로 관리하지 않고, publish하는 시점 기준으로 미리 subscribe 등록 대기 중인 클라이언트들을 대상으로만 메시지를 전달한다.
