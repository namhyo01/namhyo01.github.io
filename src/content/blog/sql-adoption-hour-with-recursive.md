---
title: '[Group by] 입양 시각 구하기(2) - set, with recursive'
description: '코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.'
pubDate: 2023-02-23
category: 'DB/MySQL'
tistoryId: 41
---
<https://school.programmers.co.kr/learn/courses/30/lessons/59413>

프로그래머스

코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.

programmers.co.kr

풀이

이 문제를 푸는대에는 크게 2가지의 해법이 있는 것 같다.

난 전자로 풀었는데 뒤에 후자 방법도 엄청 신박해 보여 공부를 진행해 보자.

1. With

<https://wakestand.tistory.com/455>

MySQL WITH 절 사용법 및 예제(가상 테이블)

MySQL에서는 오라클과 동일하게 WITH 문으로 가상테이블을 만들 수 있는데 작성방법은 다음과 같다 WITH 가상테이블명 AS ( SELECT 쿼리 UNION ALL -- 뭐 붙이거나 할 경우 추가 SELECT 쿼리 ) WITH를 이용해

wakestand.tistory.com

With 명령어는 가상의 테이블을 만들어 사용하는 명령어이다.

보통 임시결과를 정의할 때 주로 사용된다.

```sql
WITH 가상테이블명 AS
(
    SELECT 쿼리
    UNION ALL -- 뭐 붙이거나 할 경우 추가
    SELECT 쿼리
)
```

With Recursive

여기서 조금 특별한 with절이 있다.

이 구문은 가상 테이블을 생성 하면서, 자신의 값을 참조하면서 값을 결정한다.

그래서 재귀의 형태로 사용 가능하다

\* 예시\
0 ~ 10의 값을 갖는 임시 테이블을 생성

```sql
WITH RECURSIVE CTE AS(
    SELECT 0 AS NUM # 초기값 설정
    UNION ALL
    SELECT NUM+1 FROM CTE
    WEHRE NUM < 10 # 반복을 멈추는 조건
)​
```

이를 이용하여 정답 코드를 작성하면

```sql
with recursive hh as (
    select 0 as hour
    union all
    select hour + 1 from hh where hour < 23
)

select hour, count(animal_id) count
from hh left join animal_outs a on hh.hour = date_format(a.datetime, '%H')
group by hour
```

이렇게 hh에 0~23의 hour이라는 컬럼을 가지는 가상 테이블을 만들고, 그것을 animal\_outs와 left outer join을 통하여 집어 넣는다.

2. 변수 사용

Mysql에는 변수를 사용할 수 있다고 한다.

나는 그 전에는 이부분을 사용한 적이 없어서 개인적으로 이 부분이 신기하였다.

변수를 사용한다면 굳이 group by를 할 필요도 없었다.

자 한번 보자.

변수 선언

```sql
set @변수명 := 값;
```

이렇게 변수를 선언한다.

그 다음엔 이제 저 변수를 사용 할 수 있다.

그러나 우리는 0~23까지의 모든 범위의 숫자가 필요하니 이를 반복해서 한다.

```sql
set @hour := -1;
select 
(@hour := @hour + 1 ) as hour, 
(select count(*) from animal_outs where hour(datetime) = @hour) as counts
from animal_outs
where @hour < 23
```

이렇게 where절에 조건을 걸어두고 hour을 계속 +1 을 하면서 계속해서 진행하면 된다.

코드

```sql
# with recursive hh as (
#     select 0 as hour
#     union all
#     select hour + 1 from hh where hour < 23
# )

# select hour, count(animal_id) count
# from hh left join animal_outs a on hh.hour = date_format(a.datetime, '%H')
# group by hour

set @hour := -1;
select 
(@hour := @hour + 1 ) as hour, 
(select count(*) from animal_outs where hour(datetime) = @hour) as counts
from animal_outs
where @hour < 23
```
