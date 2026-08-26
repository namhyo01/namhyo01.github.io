---
title: 포트폴리오
icon: fas fa-briefcase
order: 4
---

## Career

### LG전자 — MS본부

**2024.01.05 ~ 재직 중** · 광고 플랫폼 개발팀 연구원
`Go` `Gin` `Kotlin` `Spring Boot` `Redis` `Datadog` `Signoz`

TV 사업본부 광고 플랫폼 개발팀에서 LG TV의 Home 화면을 비롯한 각종 화면에 노출되는
광고를 전달하고 기록하는 일을 하고 있습니다. 그중 **ADP(Ad-Delivery Platform) 서버**를
맡아 관리합니다.

**ADP 서버가 하는 일**

- TV로부터 광고 요청을 받아 내부 광고와 외부 광고를 구분하고, 광고 VAST에 트래킹용 event를 추가해 응답합니다.
- TV에서 광고를 본 event를 받아 로깅하고 관리합니다.

#### Spring → Go 리팩토링으로 TPS 6배

10년 전 Spring으로 작성된 코드를 성능 개선과 리팩토링 목적으로 Go(Gin)로 다시 썼습니다.

- 기존에는 HTTP connection을 끊어 handshake 과정이 계속 필요했던 문제가 있었습니다. 이를 해결해 평균 응답 속도를 개선했고, **TPS가 기존 대비 6배**로 올랐습니다.
- production 배포 이후 서버 대수를 크게 줄여도 문제가 없음을 확인했습니다. **최소 12대 → 3대, 최대 36대 → 6~7대.**

#### 이후 개선 작업

- **성능 병목 개선** — Redis 접근 횟수를 제한하고 Pipeline을 도입했으며, 일부는 Lua script로 처리했습니다. 내부 캐싱을 도입해 Redis 접근 자체를 줄였습니다.
- **캐시 갱신 구조 개선** — 서버 시작 후 단 한 번만 읽어 in-memory로 쓰던 값에 refresh caching을 도입해 주기적으로 갱신되도록 바꿨습니다.
- **APM 도입** — Signoz와 Datadog을 연동해 적은 비용으로 서버 상태를 관리하고 있습니다.
- **Redis Standalone → Clustering** 전환 작업을 진행했습니다.
- **Admin 리팩토링** — Kotlin과 Spring Boot로 ADP의 데이터를 관리하는 Admin 코드를 리팩토링하고 있습니다.
- **ATC 개발** — Go로 ATC(Ad Traffic Control)를 개발했습니다. 광고 요청을 받으면 외부 광고 집행사로 원하는 라우팅 비율대로 요청을 보내는 서버입니다.

---

### 선도소프트

**2021.12.30 ~ 2022.02.28** · 인턴
`Flutter` `Spring`

선도소프트는 공간빅데이터 플랫폼 개발 전문회사로, GIS 융복합시스템 개발과 공간디지털트윈,
바이오데이터 서비스 및 플랫폼 기술지원을 제공합니다.

**야생 동물 질병관리 시스템** 애플리케이션을 만드는 팀에서 인턴을 진행했습니다.

- Flutter로 최초 버전 작업을 담당했습니다. 로그인 · 메인 · 설정 · 의뢰 신청 · 의뢰 결과 페이지를 맡았습니다.
- 기존 웹 버전이 Spring으로 작성되어 있어, 제 작업에 맞는 코드를 찾아 수정하거나 token 관련 작업을 진행했습니다.
- 인턴 기간이 끝날 때 최초 버전 개발을 마쳤고, 플레이스토어와 앱스토어에 등록된 것을 확인했습니다.

---

## Projects

### 여행파티

**2023.06 ~ 2023.12** · 백엔드 · 인프라
`Spring Boot` `MySQL` `AWS` `Kafka` `STOMP` `Jenkins`

혼자 떠나는 사람들을 위한 여행 동행 매칭 애플리케이션입니다. 개발자 3명 중 BE를 맡으며
인프라를 함께 담당했습니다.

- **AWS 인프라** — ALB와 Bastion을 뺀 전 서버를 private subnet에, 다중 AZ, ECS/ECR
- **채팅 서버** — 웹소켓에서 시작해 STOMP를 거쳐 Kafka까지. 라운드 로빈 분산 때문에 연결이 끊기던 문제를 다중 컨슈머 그룹으로 해결
- **OAuth2 소셜 로그인** — 카카오 · 구글 · 네이버 · 애플 · 인스타그램 5종

[자세히 보기](/posts/project-yeohaeng-party/) · [GitHub](https://github.com/orgs/swm-nodriversomabus/repositories)

---

### MO:HEYUM

**2022.11 ~ 2022.12** · 백엔드
`NestJS` `MongoDB` `Mongoose` `Naver Cloud Platform` `Redis`

마크다운으로 글을 적을 수 있는 SNS입니다. 부스트캠프 7기 그룹 프로젝트로,
개발자 4명이 매주 담당자를 교체해가며 개발했습니다.

- **토큰 인증** — refresh 토큰을 Redis에 TTL과 함께 저장하고, 호출할 때마다 새로 발급해 탈취 위험을 줄임
- **이메일 인증** — 6자리 코드와 salt 비교 방식
- **로깅** — exception filter로 일원화하고, 같은 로그가 두 번 쓰이던 문제 해결
- **Redis 캐싱** — 멘션 리스트 응답을 **800ms → 60ms**로 단축

[자세히 보기](/posts/project-moheyum/) · [GitHub](https://github.com/boostcampwm-2022/web34-moheyum/tree/main)

> 저장소가 속한 조직에서 보안 점검이 진행 중입니다. 점검이 끝날 때까지 코드를
> 내려받는 것은 권하지 않습니다.
{: .prompt-warning }
