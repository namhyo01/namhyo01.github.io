---
title: "Group by - 즐겨찾기가 가장 많은 식당 정보 출력하기 - 중첩질의문(쌍)"
date: 2023-02-23 18:08:21 +0900
categories: ["DB", "MySQL"]
tags: ["MySQL"]
description: "어려운 것은 아닌데, 아 이렇게도 쓸 수 있구나..."
tistory_id: 43
---
## 풀이

이번 문제는 개인적으로 신박했다.

어려운 것은 아닌데, 아 이렇게도 쓸 수 있구나...

중첩 질의문의 in을 이렇게 쌍으로 받는 형식은 처음 써봐서 개인적으로 더 신기 하였다.

```sql
where (food_type, favorites) in (
    select food_type, max(favorites)
    from rest_info
    group by food_type
)
```

이렇게 괄호 안에 넣어서 동시에 적용되게 만드는 방법이 있다.

문제를 자세히 보면 음식 종류별로 즐겨찾기가 가장 많은 식당의 음식 종류라고 하였다.

그렇기에 이렇게 작성해야 한다.

## 코드

```sql
SELECT food_type, rest_id, rest_name, favorites
from rest_info
where (food_type, favorites) in (
    select food_type, max(favorites)
    from rest_info
    group by food_type
)
order by food_type desc
```
