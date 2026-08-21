---
title: "SUM,MAX,MIN - 중복 제거"
date: 2023-02-22 21:43:51 +0900
categories: ["DB", "MySQL"]
tags: ["MySQL"]
description: "중복을 제거하는 distinct에 대해 알아두자"
tistory_id: 38
---
## 중요문법

중복을 제거하는 distinct에 대해 알아두자

## 코드

```sql
-- 코드를 입력하세요
SELECT count(distinct name) 
from animal_ins
where name is not null
```
