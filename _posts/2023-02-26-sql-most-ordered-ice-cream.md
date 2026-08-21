---
title: "Join - 주문량이 많은 아이스크림들 조회하기"
date: 2023-02-26 01:24:12 +0900
categories: ["DB", "MySQL"]
tags: ["MySQL"]
description: "코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요."
tistory_id: 46
---
<https://school.programmers.co.kr/learn/courses/30/lessons/133027>

프로그래머스

코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.

programmers.co.kr

## 풀이

아 순간 보고 머리가 아픈 문제였다.

july\_tot에서의 total\_order들의 합과 first\_half에서의 total\_order의 합을 구하라고...?

여기서 전자가 들인것이 문제였다.

그래서 차근차근 문제를 하나씩 해결해 나가보자.

일단 전자가 문제이니 저 july\_tot에서 total\_order들의 합을 구한 테이블을 가상의 테이블로 만들자.

```sql
with july_tot as
(
    SELECT sum(total_order) tot, flavor
    FROM july
    group by flavor
)
```

자 이러면 이제 문제의 난이도는 확 낮아지게 된다.

이렇게 만든 july\_tot를 first\_half와 join을 한 뒤, 그것을 정렬하고 limit을 걸면 끝이 난다.

## 코드

```sql
-- 코드를 입력하세요
with july_tot as
(
    SELECT sum(total_order) tot, flavor
    FROM july
    group by flavor
)

select a.flavor
from july_tot a join FIRST_HALF b on a.flavor = b.flavor
order by (a.tot + b.total_order) desc
limit 3
```
