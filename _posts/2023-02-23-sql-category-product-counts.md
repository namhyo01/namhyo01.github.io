---
title: "String, Date - 카테고리별 상품 개수 구하기"
date: 2023-02-23 20:20:44 +0900
categories: ["DB", "MySQL"]
tags: ["MySQL"]
description: "코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요."
tistory_id: 45
---
## <https://school.programmers.co.kr/learn/courses/30/lessons/131529>

프로그래머스

코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.

programmers.co.kr

## 공부

이번 파트에서 배울 파트는 문자열 자르기이다.

Mysql에서 많은 기능들을 제공하는데, 그 중 알면 쓰고, 모르면 못 쓰는 자르기 기능에 대해 알아보자.

### Left

: 왼쪽에서 부터 자르기

left(컬럼명 or 문자열, 길이)

ex) select left("안녕하세요",2) => 안녕

### Substring

: 중간에서 부터 자르기

substring(컬럼 or 문자열, 시작 위치, 길이)

ex) select substring("choong", 3,2) => oo

### Right

: 오른쪽에서 부터 자르기

right(컬럼명 or 문자열, 길이)

ex) select right("안녕하세요",2) => 세요

### Substring\_index

: 구분자가 count만큼 나오기 전에 return

substring\_index(str, delimiter, count)

ex) select substring\_index("www.chungang.com",'.',2) => www.chungang

## 코드

```sql
-- 코드를 입력하세요
SELECT left(product_code, 2) category, count(*) products
from PRODUCT 
group by category
```
