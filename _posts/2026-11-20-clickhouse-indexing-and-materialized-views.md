---
title: "덜 읽거나, 미리 줄이거나 — ClickHouse 7·8장"
date: 2026-11-20 23:25:00 +0900
categories: ["DB", "ClickHouse"]
tags: ["clickhouse", "index", "projection", "materialized-view", "발표자료"]
description: "인덱스·프로젝션·PREWHERE를 EXPLAIN으로 확인하고, Materialized View와 AggregatingMergeTree의 함정을 25.8에서 직접 재현한 발표 자료. 질문 리스트 포함."
---

『Learn ClickHouse 마스터클래스』 7장(성능 최적화와 인덱싱)과 8장(Materialized View 파이프라인)을 공부하며 만든 발표 자료입니다.
교재의 설명은 **ClickHouse 25.8 Docker 컨테이너에서 직접 돌려 보며** 확인했습니다.

<div style="position: relative; width: 100%; aspect-ratio: 16 / 9; border-radius: 8px; overflow: hidden; background: #191919;">
  <iframe src="/assets/slides/clickhouse-indexing-and-materialized-views.html" title="덜 읽거나, 미리 줄이거나 — 슬라이드" loading="lazy" allowfullscreen style="position: absolute; inset: 0; width: 100%; height: 100%; border: 0;"></iframe>
</div>

> 슬라이드를 클릭하거나 `←` `→` 키로 넘깁니다. `F` 는 전체 화면, `N` 은 발표 메모.
> [새 탭에서 크게 보기](/assets/slides/clickhouse-indexing-and-materialized-views.html)
{: .prompt-tip }

## 다루는 내용

| 파트 | 질문 | 다루는 것 |
| --- | --- | --- |
| 1 | 쿼리는 무엇을 건너뛰나? | 읽기 경로 4단 필터, 희소 인덱스, 정렬 키 순서, 파티션 프루닝 |
| 2 | 정렬 키 밖 조건은 어떻게 빠르게? | 스킵 인덱스, 프로젝션, PREWHERE, EXPLAIN |
| 3 | MV는 언제, 무엇을 실행하나? | INSERT 트리거, 실패 전파, TO 패턴 |
| 4 | 집계 상태 · 연쇄 · 백필의 함정 | -State / -Merge, 일반 컬럼, 연쇄 MV, POPULATE, ATTACH PARTITION, MV 안 JOIN |

## 직접 재 본 숫자 세 개

| 숫자 | 무엇 | 이유 |
| --- | --- | --- |
| **489 / 489** | tokenbf_v1 인덱스를 걸고 `LIKE '%timeout%'` | 인덱스가 Granule을 하나도 못 줄였다. `hasToken`으로 물으면 3 / 489 |
| **15 → 10** | 교재 DDL 그대로 만든 1분 집계 테이블의 요청 수, Merge 전 → 후 | AggregatingMergeTree의 일반 `UInt64` 컬럼은 Merge 때 합쳐지지 않는다 |
| **2행** | MV가 예외를 던져 클라이언트는 에러를 받았는데 소스 테이블 행 수 | MV 실패는 롤백이 아니다. 재시도하면 소스에 중복 |

## 교재와 실제(25.8)가 달랐던 것

| 교재 내용 | 실제 확인 결과 |
| --- | --- |
| `primary.idx`, `.mrk2` | `primary.cidx`, `.cmrk2` (압축이 기본) |
| Granule = 8,192행 | `index_granularity_bytes`(10 MiB) 때문에 행이 크면 더 작아짐 |
| `EXPLAIN SYNTAX`로 단조 함수 변환 확인 | 변환이 안 보임. **`EXPLAIN indexes = 1`의 Condition·Granules**로 확인 |
| tokenbf_v1 + `LIKE '%timeout%'` | **489/489, 인덱스 효과 없음.** `hasToken`이면 3/489 |
| 스킵 인덱스 다섯 가지 | 25.8에 `text`(실험), `vector_similarity` 등 추가 |
| 프로젝션 비용 = 저장·쓰기·Merge | + **Lightweight DELETE/UPDATE 기본 거부** |
| `optimize_move_to_prewhere = 1`을 쓰면 | **이미 기본값 1** |
| "Selected Marks: X of Y" | 25.8 출력은 `Granules: a/b` |
| PIPELINE의 Repartition · Exchange | 25.8 출력에 없음 (`Resize`는 있음) |
| MV = 원자적 체인 | MV 실패 시 클라이언트는 에러, **소스는 이미 커밋** (부분 성공) |
| `ENGINE = SummingMergeTree()` 내부 테이블 MV | ORDER BY 없어서 **에러** |
| AggregatingMergeTree에 `total_requests UInt64` | Merge 후 **15 → 10, 5 → 0**. `SimpleAggregateFunction(sum, …)` 필요 |
| `TO … POPULATE` | **문법 에러** (함께 못 씀) |
| `materialized_views_populate_atomically` | 25.8에 **없는 설정** |
| ATTACH PARTITION = O(1) 무중단 교체 | 같은 파티션이 있으면 **추가(중복)**. 교체는 `REPLACE PARTITION` |
| 연쇄 MV 중간 테이블 직접 백필 | 하류 MV로 **자동 전파** → 하류를 또 백필하면 중복 |

## 질문 리스트

정답이 없는 질문들입니다. 스터디에서 각자의 언어로 설명해 보려고 만들었습니다.

**왜 그렇게 동작할까?**

- **Q1.** 희소 인덱스는 왜 행이 아니라 8,192행 Granule을 가리킬까? 점 조회에서 무엇을 포기했나?  
   <small>생각해 볼 점: 인덱스 크기(400만 행 → 490개) vs 점 조회 시 최소 8,192행 읽기</small>
- **Q2.** 앞 컬럼을 건너뛴 조건은 왜 generic exclusion search가 될까? 어떤 데이터라면 그래도 줄일 수 있을까?  
   <small>생각해 볼 점: 앞 컬럼의 카디널리티가 낮으면 일부 Granule은 지울 수 있다</small>
- **Q3.** tokenbf_v1은 왜 `LIKE '%timeout%'`에서 인덱스를 못 쓸까?  
   <small>생각해 볼 점: `%` 앞뒤 문자열이 완전한 토큰인지 알 수 없다</small>
- **Q4.** ClickHouse MV는 왜 주기적 재계산이 아니라 INSERT 트리거 방식을 택했을까?  
   <small>생각해 볼 점: 블록만 읽으니 싸다 vs 과거 데이터 · JOIN 대상 변경을 반영 못 한다</small>
- **Q5.** MV가 실패해도 소스를 롤백하지 않는 설계는 어떤 장점이 있을까?  
   <small>생각해 볼 점: 원본 보존이 우선 · 여러 MV가 붙었을 때 하나 때문에 전체 실패?</small>

**다른 방식으로 구현하면?**

- **Q6.** `user_id` 단독 조회를 빠르게: 정렬 키 재설계 vs bloom_filter vs 프로젝션 — 무엇을 고를까?  
   <small>생각해 볼 점: 쓰기 비용 · 저장 공간 · DELETE 가능 여부 · 다른 쿼리에 미치는 영향</small>
- **Q7.** Refreshable MV(주기적 재계산)를 쓰면 MV 안 JOIN의 시점 문제는 해결될까? 대신 무엇을 잃나?  
   <small>생각해 볼 점: 실시간성 · 재계산 비용</small>
- **Q8.** 합계 컬럼: `SimpleAggregateFunction(sum)` vs `AggregateFunction(sum)` vs SummingMergeTree — 차이는?  
   <small>생각해 볼 점: 저장 크기 · 조회 문법 · uniq · 분위수를 같이 쓸 수 있나</small>
- **Q9.** MV 체인 대신 1분 테이블에서 1시간 · 1일을 조회 시점에 집계하면?  
   <small>생각해 볼 점: 체인 지연 · 장애 전파 vs 조회 비용</small>

**실제 운영에서도 그럴까?**

- **Q10.** 운영 중인 테이블에 프로젝션을 추가했더니 DELETE가 막혔다. 어떻게 할까?  
   <small>생각해 볼 점: `lightweight_mutation_projection_mode` · ALTER DELETE · 파티션 DROP</small>
- **Q11.** MV 5개가 붙은 테이블에 초당 수천 건 INSERT가 들어오면 INSERT 지연과 Part 수는?  
   <small>생각해 볼 점: `parallel_view_processing` · 타깃마다 Part 생성</small>
- **Q12.** 이미 잘못된 스키마(일반 UInt64 합계)로 운영 중이라면 과거 데이터를 복구할 수 있을까?  
   <small>생각해 볼 점: Merge된 Part는 이미 값을 잃었다 → 원시 테이블에서 재백필</small>
- **Q13.** 백필과 실시간 INSERT의 경계 구간에서 중복 · 누락을 어떻게 검증할까?  
   <small>생각해 볼 점: MV 생성 시각 기록 · 원시 vs 집계 비교 · OPTIMIZE FINAL 후 재비교</small>
- **Q14.** 같은 쿼리를 반복 벤치마크하면 `use_query_condition_cache`가 숫자를 어떻게 왜곡할까?  
   <small>생각해 볼 점: 두 번째부터 Granule을 덜 읽는다 → 인덱스 효과로 착각</small>


## 재현 환경

```bash
docker run -d --name ch-study --ulimit nofile=262144:262144 \
  -e CLICKHOUSE_SKIP_USER_SETUP=1 clickhouse/clickhouse-server:25.8
docker exec -it ch-study clickhouse-client
```

수치는 모두 위 컨테이너(25.8.33)에서 측정한 값입니다. 버전이 다르면 기본값과 결과가 달라질 수 있습니다.
