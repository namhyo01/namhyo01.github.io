---
title: 'JOIN - 상품을 구매한 회원 비율 구하기'
description: '코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.'
pubDate: 2023-02-26
category: 'DB/MySQL'
tistoryId: 47
---
<https://school.programmers.co.kr/learn/courses/30/lessons/131534>

프로그래머스

코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.

programmers.co.kr

## 풀이

아 드디어 대망의 LV5의 join문제를 도전해 보았다.

생각보다... 쉬웠다라고나 할까 아니면 내가 잘못 풀었을 수도 있는데, 한번 코드를 올릴테니 문제가 있으면 언제든지 피드백은 환영입니다.

일단 문제에선 2021년에 가입한 사람들 수와 그 사람들 중에서 물건을 그 해, 그 월에 산 사람들의 수 이 조건들이 필요했다.

아 어질 어질 하네...

그래서 이것들을 하나 하나 생각해 보았다.

2021년에 가입한 사람들의 수 부터 구하기로 결정하였다.

간단하게 두 테이블을 join을 하고 where에 2021년 조건을 건뒤 count(\*)을 세니 111명이 나왔다.

결과가 잘 나오는 것을 보고 작업을 진행하다가 문특, 저 111이 맞는 답인가 싶은 생각이 들었다.

결국

```sql
SELECT user_id
    from USER_INFO a 
    where year(a.joined) = 2021
```

이렇게 user\_info테이블에서 직접 사람수를 체크해보니 158이 나오는 것이었다.

이 때 순간 당황하긴 하였다. 그런데 생각을 해보니, join을 하면 당연히 물건을 사진 않았으나 가입을 한 사람들이 있기에 더 적어지는 것이었다.

그렇다고 left join을 하자니 그것 또한 count값이 이상하게 나오는 것이었다.

아... 고민을 많이 했다.

결국 with절로 저 count랑 user\_id를 뽑아 낼려고했다

```sql
with joined as(
    SELECT user_id, count(*)
    from USER_INFO a 
    where year(a.joined) = 2021
)
```

아 근데 또 이렇게 하면 user\_id가 동일하게만 나오는 issue가 있어 문제가 되었다.

즉 나한테 지금 생긴 문제는 2021에 가입한 유저 수 + id 리스트

이것이 각각 필요한 상황이 되었다.

결국 with절을 2번쓰는 것으로 결정하였다.

```sql
with joined as(
    SELECT user_id
    from USER_INFO a 
    where year(a.joined) = 2021
),
joined_count as(
    select count(*) cnt
    from joined
)
```

그 다음은 특별한 게 없이 join을 이용하여 계산을 해보자

```sql
with joined as(
    SELECT user_id
    from USER_INFO a 
    where year(a.joined) = 2021
),
joined_count as(
    select count(*) cnt
    from joined
)
SELECT year(sales_date) year, month(sales_date) month, count(a.user_id) purchased_users, 
round((count(a.user_id)/(select cnt from joined_count)),1) purchased_ratio
from joined a join ONLINE_SALE b on a.user_id = b.user_id
group by year, month
order by year, month
```

하지만 또 틀렸다.

생각해보니 user수가 중복이 되는 케이스가 있었다. (여러번 살 수도 있으니)

간단하게 distinct를 이용해서 해결하면 되었다.

## 코드

```sql
with joined as(
    SELECT user_id
    from USER_INFO a 
    where year(a.joined) = 2021
),
joined_count as(
    select count(*) cnt
    from joined
)
SELECT year(sales_date) year, month(sales_date) month, count(distinct a.user_id) purchased_users, 
round((count(distinct a.user_id)/(select cnt from joined_count)),1) purchased_ratio
from joined a join ONLINE_SALE b on a.user_id = b.user_id
group by year, month
order by year, month
```
