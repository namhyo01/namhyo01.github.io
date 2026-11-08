---
# the default layout is 'page'
icon: fas fa-info-circle
order: 5
---

안녕하세요. **공유와 소통을 중요시하는 백엔드 개발자 김남효**입니다.

다른 사람의 말을 듣는 것을 좋아합니다. 좋은 것이라 판단되면 실천으로 옮기려 노력합니다.
문서로 정리하는 일이 공부에 도움이 된다고 생각해서, 배운 것들을 이렇게 기록하고 있습니다.

## Contact

| | |
| --- | --- |
| 이메일 | [namhyo01@naver.com](mailto:namhyo01@naver.com) |
| GitHub | [github.com/namhyo01](https://github.com/namhyo01) |
| 이전 블로그 | [namhyo00.tistory.com](https://namhyo00.tistory.com/) |

## Career

### LG전자 — MS본부 광고 플랫폼 개발팀

**2024.01 ~ 재직 중** · 연구원
`Go` `Gin` `Kotlin` `Spring Boot` `Redis`

LG TV 홈 화면 등에 노출되는 광고를 전달하고 기록하는 플랫폼에서 **ADP(Ad-Delivery Platform) 서버** 담당

- ADP 서버 **Spring → Go(Gin) 재작성** — TPS 6배, 운영 서버 최소 12대 → 3대 · 최대 36대 → 6~7대
- Admin 목록 API **11s → 100ms** — limit으로 id를 먼저 추린 뒤 LATERAL JOIN
- Redis Standalone → Cluster 전환, Pipeline · Lua script · 내부 캐싱으로 병목 개선
- **ATC(Ad Traffic Control)** 신규 개발 — 광고 요청을 외부 집행사로 지정 비율대로 라우팅
- Signoz · Datadog 연동으로 APM 도입

### 선도소프트

**2021.12 ~ 2022.02** · 인턴
`Flutter` `Spring`

공간빅데이터 플랫폼 개발 회사에서 **야생동물 질병관리 시스템** 앱 개발 참여

- Flutter로 앱 최초 버전 개발, 인턴 종료 시점에 Play Store · App Store 출시 확인

각 경력의 자세한 내용은 [Portfolio](/portfolio/)에 정리했습니다.
{: .prompt-tip }

## Skill

**Backend**
: Go (Gin) · Spring Boot · NestJS · Express

**Language**
: Go · Java · Kotlin · JavaScript · Python · Dart

**Data**
: MySQL · MongoDB · Redis · Kafka

**Infra**
: AWS · Docker · Jenkins · Signoz · Datadog

**Mobile**
: Flutter

## Education

### 중앙대학교 소프트웨어학과

**2016.03 ~ 2023.02** · 졸업

## Experience

### SW마에스트로 14기

**2023.03 ~ 2023.12**

팀 프로젝트 [여행파티](/posts/project-yeohaeng-party/)(여행 동행 매칭 앱) 백엔드 · 인프라 담당

- 채팅 서버 (STOMP + Kafka)
- 로그인 및 회원 정보 관리
- CI/CD
- AWS 인프라 구축

자세한 내용은 [Portfolio](/portfolio/)에 정리했습니다.

### 네이버 커넥트재단 부스트캠프 웹・모바일 7기

**챌린지 과정** — 2022.07.18 ~ 2022.08.12
: CS 학습 후 JavaScript로 직접 구현

**멤버십 과정** — 2022.08.31 ~ 2022.12.16
: 학습 스프린트(8주) — HTML/CSS, 비동기 제어, React, NestJS, 배포 · CI/CD
: 그룹 프로젝트(6주) — [MO:HEYUM](/posts/project-moheyum/)(마크다운 SNS) 개발
