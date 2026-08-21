---
title: 'JOIN - 보호소에서 중성화한 동물'
description: '코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.'
pubDate: 2023-02-26
category: 'DB/MySQL'
tistoryId: 48
---
<https://school.programmers.co.kr/learn/courses/30/lessons/59045>

프로그래머스

코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.

programmers.co.kr

## 풀이

아니... 뭔 이런게 LV4? 라는 생각이 들정도로 너무 쉬운 문제였다.

이게 lv3보다 어려울 이유가 없다라는 것이 내 개인적인 생각이다.

아마 animal\_ins에서의 조건과 animal\_outs에서의 조건이 and 관계인데, 후자에선 조건을 or관계로 두개를 엮어야해서 그러지 않을까 싶다.

뭐 그러려니 해도 우리에겐 괄호가 있어서... 눈감고도 풀 수 있는 문제이다.

다들 겁먹지 말고 간단하게 생각하고 코드를 작성하자!

## 코드

```sql
SELECT a.animal_id, a.animal_type, a.name
from ANIMAL_INS a join ANIMAL_OUTS b on a.animal_id = b.animal_id
where a.sex_upon_intake like '%intact%' and (b.SEX_UPON_OUTCOME like '%Spayed%' or b.SEX_UPON_OUTCOME like '%Neutered%')
order by a.animal_id
```
