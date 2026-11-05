---
title: "불변 Part 하나로 이해하는 ClickHouse 내부"
date: 2026-11-05 22:30:00 +0900
categories: ["DB", "ClickHouse"]
tags: ["clickhouse", "mergetree", "olap", "발표자료"]
description: "쿼리 실행, 저장 구조, Mutation, 분산까지 — ClickHouse의 동작을 '한 번 쓴 Part는 바뀌지 않는다'는 사실 하나로 묶어 본 발표 자료. 모든 수치는 25.8에서 직접 측정했다."
---

『Learn ClickHouse 마스터클래스』 3장(핵심 아키텍처)과 4장(데이터 타입과 DDL)을 공부하며 만든 발표 자료입니다.
교재의 설명은 **ClickHouse 25.8 Docker 컨테이너에서 직접 돌려 보며** 확인했습니다.

<div style="position: relative; width: 100%; aspect-ratio: 16 / 9; border-radius: 8px; overflow: hidden; background: #191919;">
  <iframe src="/assets/slides/clickhouse-immutable-part.html" title="불변 Part 하나로 이해하는 ClickHouse 내부 — 슬라이드" loading="lazy" allowfullscreen style="position: absolute; inset: 0; width: 100%; height: 100%; border: 0;"></iframe>
</div>

> 슬라이드를 클릭하거나 `←` `→` 키로 넘깁니다. `F` 는 전체 화면, `N` 은 발표 메모.
> [새 탭에서 크게 보기](/assets/slides/clickhouse-immutable-part.html)
{: .prompt-tip }

## 다루는 내용

| 파트 | 질문 | 다루는 것 |
| --- | --- | --- |
| 1 | 쿼리는 어떻게 빨라지나? | 6단계 변환, 옵티마이저, Processor 파이프라인, 병렬성, 정렬 키 |
| 2 | 데이터는 디스크에 어떻게 놓이나? | 타입별 실제 파일, Nullable · LowCardinality, 코덱, 계산 컬럼 |
| 3 | 불변인데 데이터는 어떻게 바뀌나? | Part 수명 주기, Mutation, 무거운 ALTER와 가벼운 ALTER |
| 4 | 노드가 여러 대면 무엇이 달라지나? | Keeper, Scatter-Gather, 일관성의 경계 |

## 직접 재 본 숫자 세 개

| 숫자 | 무엇 | 이유 |
| --- | --- | --- |
| **120배** | 같은 100만 행, 같은 `LIMIT 5` 인데 읽은 행 수 차이 (8,192 vs 1,000,000) | 정렬 키 순서로 정렬하면 Sort 단계가 사라지고 Granule 하나만 읽고 멈춘다 |
| **3행** | 1행만 `ALTER … UPDATE` 했는데 다시 쓴 행 수 | Mutation은 Part 단위로 새 Part를 쓴다 (`all_1_3_1` → `all_1_3_1_4`) |
| **1.0배** | 1분 간격 `DateTime` 100만 개의 기본(LZ4) 압축률 | 값이 전부 달라 반복이 없다. `DoubleDelta, ZSTD(1)` 이면 860배 |

## 교재와 실제(25.8)가 달랐던 것

| 교재 | 25.8 에서 확인한 결과 |
| --- | --- |
| `RLE + LZ4` 코덱 조합 권장 | `RLE` 코덱이 없다 — `UNKNOWN_CODEC: Unknown codec family: RLE` |
| `x = 10 OR x = 20` → `x IN (10, 20)` | 2개는 그대로. `optimize_min_equality_disjunction_chain_length = 3` 이라 3개부터 바뀐다 |
| 정렬된 순서로 집계해 메모리 절약 | `optimize_aggregation_in_order` 기본값 `0` (꺼짐) |
| `MODIFY COLUMN` 은 점진적으로 변환 | 코덱 변경만 그렇다. **타입 변경은 Mutation** 으로 Part를 다시 쓴다 |
| 단일 INSERT는 원자적 | Block 단위다. 300만 행 INSERT 한 번이 Part 3개가 됐다 |

옵티마이저가 쿼리를 어떻게 바꿨는지는 `EXPLAIN SYNTAX` 로는 보이지 않습니다. 25.x 의 Analyzer 는 쿼리 트리 단계에서 최적화하기 때문에 아래처럼 봐야 합니다.

```sql
EXPLAIN QUERY TREE dump_tree = 0, dump_ast = 1
SELECT sum(a * 2) FROM logs
WHERE toYear(event_time) = 2025 AND (status = 1 OR status = 2 OR status = 3);

-- 25.8 결과 (요약)
-- SELECT sum(a) * 2 FROM logs
-- WHERE status IN (1, 2, 3)
--   AND event_time >= '2025-01-01 00:00:00' AND event_time < '2026-01-01 00:00:00'
```

## 재현 환경

```bash
docker run -d --name ch-study --ulimit nofile=262144:262144 \
  -e CLICKHOUSE_SKIP_USER_SETUP=1 clickhouse/clickhouse-server:25.8
docker exec -it ch-study clickhouse-client
```

애니메이션은 Pillow 로 직접 그렸고, 수치는 모두 위 컨테이너(25.8.33)에서 측정한 값입니다. 버전이 다르면 기본값과 결과가 달라질 수 있습니다.
