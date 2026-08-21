---
title: "JOIN - 5월 식품들의 총매출 조회하기"
date: 2023-02-26 12:24:43 +0900
categories: ["DB", "MySQL"]
tags: ["MySQL"]
description: "코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요."
tistory_id: 49
---
<https://school.programmers.co.kr/learn/courses/30/lessons/131117>

프로그래머스

코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.

programmers.co.kr

## 풀이

뭔가 group by에 비해 문제들의 난이도가 낮아진 것 같은 느낌이 든다

같은 LV4라 하더라도 이정도면 LV2정도로 내려도 되지 않을까 싶은 정도였다.

2022년 5월달의 상품 수량 총이랑 그것의 가격을 곱하면 끝나는 문제였다.

그래서 간단하게 저 전자를 with절로 빼서 미리 계산을 진행하였다.

2022년 5월달에 해당하는 id와 그 수량을 구하고, 그것들을 food\_product에 있는 price랑 곱하는것이 계산의 끝!

## 코드

```sql
with sales as (
    SELECT product_id, sum(amount) tot
    from  food_order 
    where date_format(PRODUCE_DATE,'%Y-%m')='2022-05'
    group by product_id
)
select a.product_id, product_name, (price * tot) total_sales
from sales a join FOOD_PRODUCT b on a.product_id = b.product_id
order by total_sales desc, a.product_id
```
