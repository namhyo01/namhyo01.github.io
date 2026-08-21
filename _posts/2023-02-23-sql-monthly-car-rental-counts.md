---
title: "Group by - 대여 횟수가 많은 자동차들의 월별 대여 횟수 구하기"
date: 2023-02-23 15:00:21 +0900
categories: ["DB", "MySQL"]
tags: ["MySQL"]
description: "사실 큰 틀은 달라진게 없으나 내가 생각을 하나 놓쳤었다."
tistory_id: 42
---
## 풀이

이번 문제는 많이 까다롭다....

사실 큰 틀은 달라진게 없으나 내가 생각을 하나 놓쳤었다.

```sql
SELECT month(start_date) month, car_id, count(history_id) records
from CAR_RENTAL_COMPANY_RENTAL_HISTORY 
where start_date >= '2022-08-01' and start_date <= '2022-10-31'
group by month, car_id
having count(history_id) >= 5) and start_date >= '2022-08-01' and start_date <= '2022-10-31'
```

처음엔 코드를 이렇게 짜고 실행을 해보았지만 당연히 틀렸다는 결과가 나왔다.

무엇이 문제일까....하다가 문제 조건을 보니 특정 월의 **총 대여 횟수가** 0인 경우 결과에서 제외한다.

이 부분을 놓쳤었다.

자 그럼 저 부분을 어떻게 해야하나 말인가.

저 위에 sql문이 무엇을 위한 코드인가를 곰곰히 생각해보니, 8~10월달 동안의 월별, 차별 기록인데 그것이 5회 이상인 것들만 센 것이다.

자 그럼 이것만으로는 특정 월의 총 대여횟수가 0인것을 판별이 불가능하다.

그걸 판별하는 것은 저 count가 0이냐 0이 아니냐로 판단하는 거이기에...

그래서 푸는 방법을 알아본 결과 중첩 질의문을 이용하면 되던 문제였다.

위에 있는 것을 활용해 5회 이상인 것을 고르고 (3달 동안의), 여기서 뽑아낸 car\_id를 기준으로 한번 더 group by를 월별, 차별로 진행해, records가 0 초과인 것만 고르면 된다.

그 코드가 밑의 코드이다.

## 코드

```sql
-- 코드를 입력하세요
SELECT month(start_date) month, car_id, count(history_id) records
from CAR_RENTAL_COMPANY_RENTAL_HISTORY 
where car_id in
(select car_id
from CAR_RENTAL_COMPANY_RENTAL_HISTORY 
where start_date >= '2022-08-01' and start_date <= '2022-10-31'
group by car_id
having count(history_id) >= 5) and start_date >= '2022-08-01' and start_date <= '2022-10-31'
group by month, car_id
having records > 0
order by month, car_id desc
```
