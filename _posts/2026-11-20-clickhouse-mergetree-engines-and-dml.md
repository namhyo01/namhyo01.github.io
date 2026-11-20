---
title: "INSERT가 아니라 Merge가 데이터를 바꾼다 — ClickHouse 5·6장"
date: 2026-11-20 23:20:00 +0900
categories: ["DB", "ClickHouse"]
tags: ["clickhouse", "mergetree", "dml", "join", "발표자료"]
description: "MergeTree 엔진 패밀리와 고급 SQL·DML을 'Merge 때 무엇이 바뀌나'로 묶어 본 발표 자료. 교재 설명을 25.8에서 직접 돌려 보고, 다르게 동작한 16가지를 정리했다."
---

『Learn ClickHouse 마스터클래스』 5장(MergeTree 엔진 패밀리)과 6장(고급 SQL과 DML)을 공부하며 만든 발표 자료입니다.
교재의 설명은 **ClickHouse 25.8 Docker 컨테이너에서 직접 돌려 보며** 확인했습니다.

<div style="position: relative; width: 100%; aspect-ratio: 16 / 9; border-radius: 8px; overflow: hidden; background: #191919;">
  <iframe src="/assets/slides/clickhouse-mergetree-engines-and-dml.html" title="INSERT가 아니라 Merge가 데이터를 바꾼다 — 슬라이드" loading="lazy" allowfullscreen style="position: absolute; inset: 0; width: 100%; height: 100%; border: 0;"></iframe>
</div>

> 슬라이드를 클릭하거나 `←` `→` 키로 넘깁니다. `F` 는 전체 화면, `N` 은 발표 메모.
> [새 탭에서 크게 보기](/assets/slides/clickhouse-mergetree-engines-and-dml.html)
{: .prompt-tip }

## 다루는 내용

| 파트 | 질문 | 다루는 것 |
| --- | --- | --- |
| 1 | Part는 디스크에 어떻게 생겼나? | Part 이름, 실제 파일, Compact와 Wide, LSM-Tree와의 차이 |
| 2 | 엔진은 Merge 때 무엇을 하나? | Replacing · Summing · Aggregating · Collapsing, FINAL |
| 3 | 지우고, 고치고, 만료시키기 | Mutation, Lightweight DELETE / UPDATE, TTL |
| 4 | 쓰기 · JOIN · 분석 SQL의 비용 | Part 폭증, async_insert, 중복 제거, 분산 JOIN, 콤비네이터, windowFunnel |

## 직접 재 본 숫자 세 개

| 숫자 | 무엇 | 이유 |
| --- | --- | --- |
| **4행** | ReplacingMergeTree에 같은 키를 2개씩 넣고 바로 `count()` | 중복 정리는 INSERT가 아니라 Merge 또는 FINAL 때 일어난다 |
| **2 / 4건** | 샤딩 키가 다른 두 Distributed 테이블을 `distributed_product_mode = 'local'`로 JOIN | 샤드마다 자기 데이터끼리만 JOIN해서 절반이 빠진다. 기본값(`deny`)에서는 아예 에러 |
| **2단계** | A→B→C를 20분 간격으로 넣고 `windowFunnel(1800)` | 창은 직전 단계가 아니라 첫 단계부터 잰다 |

## 교재와 실제(25.8)가 달랐던 것

| 교재 내용 | 실제 확인 결과 |
| --- | --- |
| Part 파일 `primary.idx`, `.mrk2` | `primary.cidx`, `.cmrk2` (압축 Mark/인덱스가 기본) |
| `is_deleted` 행이 Merge 때 제거될 수 있음 | 일반 `OPTIMIZE FINAL`로는 **안 지워짐**. `FINAL CLEANUP` + 실험 설정 필요 |
| `quantilesMerge(quantiles)(quantiles)` | **에러**. 파라미터는 상수: `quantilesMerge(0.5, 0.95)(col)` |
| Mutation이 전체 컬럼 파일을 다시 씀 | **바뀐 컬럼만** 새로 씀 (나머지는 하드링크) |
| UPDATE는 Mutation뿐 | 25.8에 Lightweight UPDATE(patch part) 있음. `_block_number` 컬럼 필요 |
| TTL GROUP BY 예시 | GROUP BY 키가 **정렬 키의 접두사**여야 함 (아니면 `BAD_TTL_EXPRESSION`) |
| `TO VOLUME 's3_cold'` | 예시 XML의 볼륨 이름(`hot`/`cold`)과 불일치 |
| `Too many parts in all data parts` | 실제로 먼저 만나는 건 파티션 단위 `TOO_MANY_PARTS` (기본 3000) |
| `async_insert_max_data_size` ≈ 100KB~1MB | **10 MiB**. busy timeout도 50~200ms **적응형** |
| 중복 제거 "최근 100개 Part" | Replicated **1000개**. 일반 MergeTree는 기본 **0 (꺼짐)** |
| `join_algorithm` 선택 | 기본값 `direct,parallel_hash,hash` + 좌우 자동 교환(`auto`) |
| Distributed끼리 일반 JOIN = 샤드별 로컬 JOIN | 기본 `deny` → **에러**. `local`로 바꾸면 샤딩 불일치 시 실제로 누락 |
| `sumForEach([1,2,3], [10,20,30])` → [11,22,33] | **에러**. 두 배열을 두 행으로 넣어야 함 |
| `avgResample(0, 86400, 3600)(latency, event_time)` | DateTime이면 **모든 구간이 nan**. 상대 초로 변환 필요 |
| windowFunnel: 직전 단계 기준 창 | **첫 단계 기준** 창 (실측 결과 2단계) |
| `ARRAY JOIN` 예시 | 빈 배열 행은 결과에서 빠짐 → `LEFT ARRAY JOIN` |

## 재현 환경

```bash
docker run -d --name ch-study --ulimit nofile=262144:262144 \
  -e CLICKHOUSE_SKIP_USER_SETUP=1 clickhouse/clickhouse-server:25.8
docker exec -it ch-study clickhouse-client
```

수치는 모두 위 컨테이너(25.8.33)에서 측정한 값입니다. 버전이 다르면 기본값과 결과가 달라질 수 있습니다.
