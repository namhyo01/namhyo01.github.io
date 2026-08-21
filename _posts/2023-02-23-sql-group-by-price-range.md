---
title: "[Group By] 가격대 별 상품 개수 구하기"
date: 2023-02-23 00:17:49 +0900
categories: ["DB", "MySQL"]
tags: ["MySQL"]
description: "MySQL : 숫자 함수 : 절대값, 올림, 내림, 반올림, 버림, 제곱, 나머지, 최대값, 최소값 : 사용법, 예"
tistory_id: 39
---
## 중요한 문법

<https://jjeongil.tistory.com/928>

MySQL : 숫자 함수 : 절대값, 올림, 내림, 반올림, 버림, 제곱, 나머지, 최대값, 최소값 : 사용법, 예

숫자와 관련된 작업을 하는 함수에 대해 알아보도록 하겠습니다. ABS(숫자) : 절대값을 구합니다. CEIL(숫자) : 값보다 큰 정수 중 가장 작은 정수를 구합니다. 소수점 이하 올림을 의미합니다. FLOOR(

jjeongil.tistory.com

위 사이트를 참고하였다.

> ABS(숫자) : 절대값을 구합니다.
>
> CEIL(숫자) : 값보다 큰 정수 중 가장 작은 정수를 구합니다. 소수점 이하 올림을 의미합니다.
>
> FLOOR(숫자) : 값보다 작은 정수 중 가장 큰 정수를 구합니다. 소수점 이하 버림을 의미합니다.
>
> ROUND(숫자, 자릿수) : 자릿수를 기준으로 반올림합니다.
>
> TRUNCATE(숫자, 자릿수) : 자릿수를 기준으로 버림합니다.
>
> POW(X, Y) , POWER(X, Y) : X의 Y승을 의미합니다.
>
> MOD(분자, 분모) : 분자를 분모로 나눈 나머지를 구합니다.
>
> GREATEST(숫자1, 숫자2, ...) : 주어진 숫자 중에 가장 큰 값을 반환합니다.
>
> LEAST(숫자1, 숫자2, ...) : 주어진 숫자 중에 가장 작은 값을 반환합니다.

```sql
# 절대값
select abs(100), abs(-100);

# 올림
# 소수점 이상 올림
select ceil(10.1), ceil(10.4), ceil(10.5), ceil(10.0);

# 내림
# 소수점 버림
select floor(10.1), floor(10.4), floor(10.5), floor(10.0);

# 버림
# 자릿수 기준 버림
select truncate(10,-2)

# 반올림
select round(10.1), round(10.4), round(10.5), round(10.0);
select round(1.23456789, 1), round(1.23456789, 4), round(1.23456789, 7);

# 제곱
select pow(10, 2);

# 나머지
select mod(10, 3);

# 최대값
select greatest(10, 4, 20, 1);

# 최소값
select least(10, 4, 20, 1);
```

## 정답 코드

```sql
-- 코드를 입력하세요
SELECT truncate(price,-4) as price_group, count(*) as products
from product
group by price_group
order by price_group
```
