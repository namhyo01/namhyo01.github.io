---
title: 'SELECT - 오프라인/온라인 판매 데이터 통합하기'
description: '코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.'
pubDate: 2023-02-22
category: 'DB/MySQL'
tistoryId: 34
---
## 문제

<https://school.programmers.co.kr/learn/courses/30/lessons/131537>

프로그래머스

코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.

programmers.co.kr

오프라인에 들어간 데이터와 온라인에 들어간 데이터를 각각 뽑아 합치는 문제이다.\
나는 처음에 이 문제가 Left Outer Join을 이용해서 문제를 푸는 건가 싶어서 고민을 했었는데, 그런 유형의 문제가 아니라,\
그냥 각각의 데이터를 뽑아 합치는 문제였다.\
합치는 명령어는 **UNION** or **UNION ALL**이 둘 중 하나를 사용하는 것으로 알고 있다.

### UNION DISTINCT

: 쿼리의 결과를 합치기는 합치는데 중복된 행은 제거를 한다

### UNION ALL

: 쿼리의 결과를 중복도 제거하지 않고 합친다

## 코드

```sql
SELECT date_format(SALES_DATE,'%Y-%m-%d') AS SALES_DATE, PRODUCT_ID, USER_ID, SALES_AMOUNT
FROM ONLINE_SALE
WHERE year(SALES_DATE) = 2022 AND month(SALES_DATE) = 3

UNION ALL

SELECT date_format(SALES_DATE,'%Y-%m-%d') AS SALES_DATE, PRODUCT_ID, NULL USER_ID, SALES_AMOUNT
FROM OFFLINE_SALE
WHERE year(SALES_DATE) = 2022 AND month(SALES_DATE) = 3

ORDER BY SALES_DATE, PRODUCT_ID, USER_ID
```
