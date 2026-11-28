---
title: "데이터는 노드끼리, 약속은 Keeper에 — ClickHouse 9·10장"
date: 2026-11-28 09:50:00 +0900
categories: ["DB", "ClickHouse"]
tags: ["clickhouse", "kubernetes", "replication", "distributed", "발표자료"]
description: "K8s + Helm 배포와 분산·고가용성을 'Keeper에는 약속만, 파트는 노드끼리'로 묶은 발표 자료. 10장은 Keeper + 2샤드×2레플리카 Docker 클러스터에서 직접 실행했고, 교재와 다르게 동작한 18가지를 정리했다."
---

『Learn ClickHouse 마스터클래스』 9장(K8s + Helm 프로덕션 배포)과 10장(분산 아키텍처와 고가용성)을 공부하며 만든 발표 자료입니다.
10장은 **Keeper 1대 + 2샤드×2레플리카 ClickHouse 25.8 클러스터를 Docker Compose로 띄워** 직접 확인했습니다. 9장은 Kubernetes를 띄우지 않고, ClickHouse 쪽 설정은 컨테이너로 실행해 보고 Operator 쪽은 Altinity clickhouse-operator(release-0.27.4) 소스와 공식 문서로 대조했습니다.

<div style="position: relative; width: 100%; aspect-ratio: 16 / 9; border-radius: 8px; overflow: hidden; background: #191919;">
  <iframe src="/assets/slides/clickhouse-k8s-and-distributed.html" title="데이터는 노드끼리, 약속은 Keeper에 — 슬라이드" loading="lazy" allowfullscreen style="position: absolute; inset: 0; width: 100%; height: 100%; border: 0;"></iframe>
</div>

> 슬라이드를 클릭하거나 `←` `→` 키로 넘깁니다. `F` 는 전체 화면, `N` 은 발표 메모.
> [새 탭에서 크게 보기](/assets/slides/clickhouse-k8s-and-distributed.html)
{: .prompt-tip }

## 다루는 내용

| 파트 | 질문 | 다루는 것 |
| --- | --- | --- |
| 1 | K8s에 ClickHouse를 올릴 때 무엇이 깨지나? | Operator vs Helm, CHI 설정 위치, Keeper 분리, PVC·AZ, S3 계층, PDB, 커널 설정 |
| 2 | 복제는 무엇을 어디로 보내나? | 샤딩 vs 복제, Keeper 로그와 P2P 파트 전송, 머지 복제, ON CLUSTER 없는 DDL |
| 3 | Distributed는 읽기와 쓰기를 어떻게 나르나? | load_balancing, 샤드 건너뛰기, Distributed INSERT 스풀 |
| 4 | 클러스터 전체를 바꾸는 일 | ON CLUSTER 장애 시 동작, DDL 큐 진단, insert_quorum, 리샤딩, FETCH PART |

## 직접 재 본 숫자 세 개

| 숫자 | 무엇 | 이유 |
| --- | --- | --- |
| **150 B** | 474 KiB 파트가 레플리카로 복제될 때 Keeper에 남은 로그 크기 | Keeper는 "어떤 파트를 가져가라"는 메모만 적는다. 파일은 노드끼리 인터서버 HTTP(9009)로 직접 |
| **2곳 → 1곳** | `WHERE user_id = …` Distributed 쿼리가 간 샤드 수 | `optimize_skip_unused_shards` 기본값이 0이라 켜야 한 샤드만 묻는다 |
| **0개 → 4개** | 타임아웃 에러가 난 `ALTER … ON CLUSTER`, 꺼졌던 노드가 돌아온 뒤 완료된 노드 수 | 에러 ≠ 실패. 노드가 Keeper 큐에서 작업을 찾아 스스로 실행한다 |

## 교재와 실제(25.8)가 달랐던 것

🔬는 직접 실행한 결과, 📎는 Altinity 소스·공식 문서로 대조한 결과입니다.

| 교재 내용 | 실제 확인 결과 |
| --- | --- |
| CHI `configuration.settings`에 `async_insert` | 🔬 서버 설정이 되어 **기동 실패** (`user-level setting … should be located in users.xml inside <profiles>`). `profiles`에 둬야 |
| `<default><path>…</path></default>` 스토리지 XML | 🔬 **기동 실패** (`"default" disk path should be provided in <path> not it <storage_configuration>`) |
| "7일 후 Cold" 정책 | XML만 있고 `TTL … TO VOLUME` + `storage_policy` DDL이 빠짐 |
| `vm.overcommit_memory` 0 또는 2 (예시 2) | 📎 공식: **0 또는 1**, overcommit을 끄지 말 것 |
| `stopClickHouseOnSync` | 📎 Altinity 0.27.4 CRD에 **없음** |
| 수동 PDB `minAvailable: 1` + `app: chop` | 📎 Operator가 클러스터별 PDB **자동 생성** (`maxUnavailable` 1). `app: chop`은 모든 CH 파드 공통 라벨 |
| 안티 어피니티 `app In [chop]` | 📎 샤드·레플리카 구분 없는 라벨. `podDistribution` 사용 |
| Keeper 9181 / Raft 9444 | 📎 공식 예시 Raft **9234**, Altinity CHK 기본 클라이언트 **2181** · Raft 9444 |
| `replicate_merge_tree_sleep_time_for_merges` | 🔬 **없는 설정**. 실제는 `always_fetch_merged_part` 등 |
| ON CLUSTER 없이 `ReplicatedMergeTree()` → 경로가 어긋날 수 있음 | 🔬 25.8은 아예 **에러** (`Macro 'uuid' … only supported …`) |
| `system.distributed_ddl_queue`의 `exception` | 🔬 **없는 컬럼** → `exception_code`, `exception_text` |
| `FETCH PART … FROM 'source_replica'` | 🔬 레플리카 이름이면 에러. **Keeper 경로**여야 |
| `load_balancing` 4가지 | 🔬 6가지 (`round_robin`, `hostname_levenshtein_distance` 추가) |
| 샤딩 키 조건으로 샤드 범위 축소 | 🔬 `optimize_skip_unused_shards` 기본 **0** → 켜야 1샤드만 |
| 리샤딩 예제 | `hits_all_v1` 미정의, `event_date` 없음, 같은 로컬 테이블 → **중복** 위험 |
| clickhouse-copier | 🔬 25.8 이미지에 **없음** |
| (교재에 없음) `internal_replication` | Replicated + Distributed면 `true` 필수. false면 중복 |
| (교재에 없음) `insert_quorum` 실패 | 🔬 에러여도 로컬에는 **이미 기록됨** (`UNKNOWN_STATUS_OF_INSERT`) |

## 질문 리스트

정답이 없는 질문들입니다. 스터디에서 각자의 언어로 설명해 보려고 만들었습니다.

**왜 그렇게 동작할까?**

- **Q1.** Keeper는 왜 파트 파일을 저장하지 않을까?  
  <small>생각해 볼 점: 합의 로그는 작고 빨라야 한다 · 474 KiB vs 150 B</small>
- **Q2.** Keeper는 왜 홀수 노드로 띄울까? 4노드는 왜 손해일까?  
  <small>생각해 볼 점: 4노드 정족수 3 → 장애 허용 1대로 3노드와 같음</small>
- **Q3.** ClickHouse는 왜 ON CLUSTER 없는 `ReplicatedMergeTree()`를 에러로 막을까?  
  <small>생각해 볼 점: 노드마다 다른 UUID → 다른 Keeper 경로 → 복제가 조용히 안 됨</small>
- **Q4.** Distributed INSERT는 왜 기본이 비동기(디스크 스풀)일까?  
  <small>생각해 볼 점: 클라이언트 지연 vs 이니시에이터 장애 시 데이터 위치</small>
- **Q5.** ON CLUSTER가 타임아웃 에러를 내도 나중에 실행되는 설계는 장점일까 위험일까?  
  <small>생각해 볼 점: 복구 후 자동 수렴 vs "에러인데 적용됨" 혼란</small>

**다른 방식으로 구현하면?**

- **Q6.** Altinity Operator 대신 Helm Chart + 직접 만든 Keeper StatefulSet으로 2×2를 운영하면 무엇을 직접 해야 할까?  
  <small>생각해 볼 점: 클러스터 정의 · 매크로 · 롤링 순서 · PDB</small>
- **Q7.** 리샤딩: 새 클러스터로 `INSERT … SELECT` vs 파트 `FETCH/ATTACH` vs 백업 복원 — 언제 무엇을?  
  <small>생각해 볼 점: 재분배 필요 여부 · 속도 · 중복 검증</small>
- **Q8.** Distributed INSERT 대신 수집기(Kafka 컨슈머)가 샤딩 키를 계산하게 하면 무엇을 얻고 무엇을 잃나?  
  <small>생각해 볼 점: 이니시에이터 스풀 제거 vs 라우팅 로직 · 레플리카 장애 처리</small>

**실제 운영에서도 그럴까?**

- **Q9.** 노드 드레인 중 같은 샤드의 레플리카 2개가 함께 내려가는 걸 막으려면?  
  <small>생각해 볼 점: podDistribution · 샤드별 PDB · AZ 분산</small>
- **Q10.** ArgoCD 자동 Sync로 이미지 태그를 바꾸면 무슨 일이 일어날까? 승인형 Sync는 언제 필요할까?  
  <small>생각해 볼 점: 롤링 재시작 · 복제 지연 · Keeper 정족수</small>
- **Q11.** `insert_quorum` 에러(`UNKNOWN_STATUS_OF_INSERT`)를 받은 클라이언트는 재시도해야 할까?  
  <small>생각해 볼 점: 이미 로컬에 기록 · 중복 제거 토큰 · 6장 멱등성</small>
- **Q12.** S3 Cold 계층의 파트를 읽는 쿼리가 느릴 때 무엇부터 볼까?  
  <small>생각해 볼 점: 캐시 · `system.parts.disk_name` · S3 요청·오류</small>

## 재현 환경

```bash
# lab10/docker-compose.yml: Keeper 1대 + ch-s1r1, ch-s1r2, ch-s2r1, ch-s2r2
docker compose up -d
docker exec -it ch-s1r1 clickhouse-client
```

클러스터 정의는 `internal_replication = true`인 2샤드 × 2레플리카이고, 노드마다 `{shard}`, `{replica}` 매크로를 줬습니다. 수치는 모두 ClickHouse 25.8.33에서 측정한 값입니다.
