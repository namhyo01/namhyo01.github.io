---
title: "SELECT - 12세 이하인 여자 환자 목록 출력하기"
date: 2023-02-22 13:27:53 +0900
categories: ["DB", "MySQL"]
tags: ["MySQL"]
description: "여기서 제일 중요하게 사용되어야 하는 것이 null처리 이다. null이 나오면 대체를 어떻게 해야하는가? 이것이 관점이다."
tistory_id: 35
---
## 주요 문법

여기서 제일 중요하게 사용되어야 하는 것이 null처리 이다.  
null이 나오면 대체를 어떻게 해야하는가? 이것이 관점이다.

<https://velog.io/@gillog/DB-MySQL-NULL-%EC%B2%98%EB%A6%ACIFNULL-CASE-COALESCE>

[DB] MySQL NULL 처리(IFNULL, CASE, COALESCE)

MySQL에서 Column의 값이 Null인 경우를 처리해주는 함수들은 IFNULL, CASE, COALESCE과 같은 함수들이 있다.Orcale의 NVL()과 비슷한 기능을 한다.해당 Column의 값이 NULL을 반환할 때, 다른 값으로 출력할 수 있

velog.io

위 블로그를 많이 참고하여 공부를 진행 하였다.

#### NULL 처리 문법들

대표적으로 IFNULL, IF, CASE, COALESCE 등이 있다.

##### IF NULL

```sql
SELECT IFNULL(Column명, "Null일 경우 대체 값") FROM 테이블명;
```

##### IF

```sql
SELECT IF(IS NULL(NAME), "No name", NAME) as NAME
FROM ANIMAL_INS
```

#### CASE

```
CASE 
    WHEN 조건식1 THEN 식1
    WHEN 조건식2 THEN 식2
    ...
    ELSE 조건에 맞는경우가 없는 경우 실행할 식
END
```

```sql
SELECT 
    CASE
        WHEN NAME IS NULL THEN "No name"
        ELSE NAME
    END as NAME
FROM ANIMAL_INS
```

#### COALESCE

**COALESCE**는 **지정한 표현식들 중에 NULL이 아닌 첫 번째 값을 반환**한다.

**COALESCE**는 배타적 OR 관계 열에서 활용도가 높다.  
엔터티(테이블)에서 두 개 이상의 속성(열) 중 하나의 값만 가지는 데이터 일 경우

```sql
// NULL 처리 상황
SELECT COALESCE(Column명1, Column명1이 NULL인 경우 대체할 값)
FROM 테이블명

// 배타적 OR 관계 열
// Column1 ~ 4 중 NULL이 아닌 첫 번째 Column을 출력
SELECT COALESCE(Column명1, Column명2, Column명3, Column명4)
FROM 테이블명
```

## 코드

```sql
SELECT PT_NAME, PT_NO, GEND_CD, AGE, IFNULL(TLNO,'NONE') AS TLNO
FROM PATIENT
WHERE AGE <= 12 AND GEND_CD = 'W'
ORDER BY AGE DESC, PT_NAME
```
