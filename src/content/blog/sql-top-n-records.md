---
title: 'SELECT - 상위 n개 레코드 구하기'
description: '코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.'
pubDate: 2023-02-22
category: 'DB/MySQL'
tistoryId: 36
---
<https://school.programmers.co.kr/learn/courses/30/lessons/59405>

프로그래머스

코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.

programmers.co.kr

## 문법

이번에는 상위 몇개의 데이터를 고르라는 문제였다.\
MYSQL을 쓰는 나한테는 간단한 문제였다.\
**LIMIT**이라는 문법을 통하여 상위 몇개의 데이터만을 가져올 수 있다.

## 코드

```sql
SELECT NAME
FROM ANIMAL_INS
ORDER BY DATETIME ASC
LIMIT 1
```
