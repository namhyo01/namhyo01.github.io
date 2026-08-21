---
title: 'Group by - 자동차 대여 기록에서 대여중 대여 가능 여부 구분하기'
description: '코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.'
pubDate: 2023-02-23
category: 'DB/MySQL'
tistoryId: 44
---
<https://school.programmers.co.kr/learn/courses/30/lessons/157340>

프로그래머스

코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.

programmers.co.kr

## 풀이

풀면서 이렇게 해도 되는건가 싶었던 문제이다.

이게... LV3?

이번엔 중첩 질의문을 쓰되, 그것을 select안에서 작업 하였다.

2022-10-16이 start\_date부터 end\_date 사이에 들어가야 하므로 저렇게 between을 사용하였다.

솔직히 특별히 아주 어렵지는 않으나 이 식을 유도하는 것이 쉽지많은 않은 것 같다.

## 코드

```sql
SELECT car_id,
    case when car_id in (
        select car_id
        from CAR_RENTAL_COMPANY_RENTAL_HISTORY 
        where '2022-10-16' between date_format(start_date,'%Y-%m-%d') and date_format(end_date,'%Y-%m-%d')
    )
    then '대여중'
    else '대여 가능'
    end
 availability
from car_rental_company_rental_history
group by car_id
order by car_id desc
```
