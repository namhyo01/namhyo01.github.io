---
title: "SELECT - 재구매가 일어난 상품과 회원 리스트 구하기"
date: 2023-02-22 18:54:06 +0900
categories: ["DB", "MySQL"]
tags: ["MySQL"]
description: "코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요."
tistory_id: 37
---
<https://school.programmers.co.kr/learn/courses/30/lessons/131536>

프로그래머스

코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.

programmers.co.kr

## 주요 볼 점

여기서 주요 볼 점은 group by 인 듯 하다.  
product\_id와 user\_id를 group으로 묶은 후 이들의 count를 센게 2개 이상일 때만 출력하는 형식이다.

## 공부 참고 사이트

<https://extbrain.tistory.com/56>

[MySQL] 그룹화하여 데이터 조회 (GROUP BY)

▶MySQL 그룹화하여 데이터 조회 (GROUP BY) ▶설명 하나, 예를 들어보겠습니다.MySQL에서 유형별로 갯수를 가져오고 싶은데, 단순히 COUNT 함수로 데이터를 조회하면 전체 갯수만을 가져옵니다.이렇게

extbrain.tistory.com

### Group By?

말 그대로 그룹화를 시켜준다 생각하면 된다.  
ex)  
MySQL에서 유형별로 갯수를 가져오고 싶은데, 단순히 COUNT 함수로 데이터를 조회하면 전체 갯수만을 가져옵니다.  
만약 유형별로 갯수를 알고 싶다면 group by를 이용하면 된다.  
**여기서 중요한 점이 group by를 이용해 그룹화를 시키면 Select해서 가져올 수 있는 컬럼은 group화 한 컬럼 or 집계 함수를 이용한 컬럼 말고는 불가능하다**

#### Having?

**where vs having 이라 생각하면 틀린다**  
where은 그룹을 하기 전에 거는 조건  
having은 그룹을 하고 난 결과물에 조건을 거는 것이다.  
큰 차이점이 있으니 조심하자

ex)

![](/assets/img/posts/sql-repurchased-products-and-members-1.png)
_출처&nbsp;https://extbrain.tistory.com/56_

```sql
SELECT type, COUNT(name) AS cnt FROM hero_collection GROUP BY type;
```

이렇게 하면 추측으로 하면 결과는 type과 count센 결과가 나올것이다.

![](/assets/img/posts/sql-repurchased-products-and-members-2.png)
_출처&nbsp;https://extbrain.tistory.com/56_

## 코드

```sql
-- 코드를 입력하세요
SELECT user_id, product_id
from online_sale
group by user_id, product_id
having count(*) >= 2
order by user_id, product_id desc
```

이렇게 group by를 이용하여 계산을 하자
