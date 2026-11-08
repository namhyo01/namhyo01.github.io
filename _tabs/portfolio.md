---
title: 포트폴리오
icon: fas fa-briefcase
order: 4
---

**TV 광고 서빙 서버를 Go로 재작성해 TPS를 6배 높이고, 운영 서버를 36대에서 6~7대로 줄인 백엔드 개발자입니다.**
문제는 수치로 확인하고 결과도 수치로 남기는 것을 중요하게 생각합니다.

## Career

### LG전자 · MS본부 광고 플랫폼 개발팀

**2024.01 ~ 재직 중** · 연구원
`Go` `Gin` `Kotlin` `Spring Boot` `Redis` `Signoz` `Datadog`

LG TV 홈 화면 등에 노출되는 광고를 전달하고 노출 이벤트를 기록하는 플랫폼에서
**ADP(Ad-Delivery Platform) 서버** 담당

- 광고 요청 수신 → 내부·외부 광고 구분 → VAST에 트래킹 이벤트 삽입 후 응답
- TV에서 보내는 광고 노출 이벤트 수신·로깅

#### ADP 서버 Spring → Go 재작성 — TPS 6배, 서버 36대 → 6~7대

- **배경** — 10년 전 Spring으로 작성된 레거시. 요청마다 HTTP 커넥션을 끊어 handshake가 반복되는 구조
- **검증** — Go(Gin) 프로토타입과 최신 Spring Boot를 성능 테스트 툴로 비교, TPS 비교표로 보고해 재작성 승인
- **해결** — Go(Gin)로 재작성하며 커넥션 재사용으로 handshake 반복 제거, 기존 오류 수정
- **결과** — TPS 약 6배, 평균 응답 속도 개선. 운영 서버 최소 12대 → 3대, 최대 36대 → 6~7대

#### Admin 목록 API 응답 11s → 100ms

- **문제** — Kotlin·Spring Boot Admin의 목록 API가 운영 기준 4~11s 소요 (pagination 적용, 목록·count 쿼리 직렬 호출)
- **원인** — 인덱스를 타더라도 21만 행에 report 데이터를 먼저 join해 중간 결과가 크게 불어남. 실제로 필요한 건 한 페이지 분량
- **해결** — limit으로 해당 페이지의 id를 먼저 추린 뒤, 그 id 기준으로 LATERAL JOIN해 report 데이터 결합
- **결과** — 응답 시간 최대 11s → 100ms

#### Redis Standalone → Cluster 전환

- **배경** — 권역마다 Redis 구성이 달라 Standalone·Cluster 양쪽에서 동작하도록 전환
- **문제** — Cluster 권역에서만 특정 API timeout. Cluster에는 DB index가 없어, 12번 DB를 대신하던 `12::*` 패턴 조회가 전체 key 탐색이 됨
- **해결** — `12::` 하위 key 목록을 담는 key를 따로 두고, 패턴 탐색 대신 이 key로 조회
- **결과** — Cluster 환경 timeout 해소, 권역별 환경 차이와 무관하게 동일 로직 유지

#### Redis 접근 최적화 · 캐시 구조 개선

- Redis 접근 횟수 제한, Pipeline·Lua script로 네트워크 왕복 감소
- 애플리케이션 내부 캐시로 Redis 접근 자체 축소
- 서버 시작 시 한 번만 읽던 값에 refresh caching 도입, 재시작 없이 주기적 갱신

#### ATC(Ad Traffic Control) 신규 개발

- 광고 요청을 외부 광고 집행사로 지정 비율에 맞춰 라우팅하는 Go 서버 개발

#### 운영 · 협업

- Signoz·Datadog 연동으로 APM 도입, 적은 비용으로 서버 모니터링
- TV 디바이스 연동 테스트용 API 개발, TV 시스템 조직과 협업
- DooH(디지털 옥외광고) 서빙 서버와 Admin(FE·BE) Go 재작성 진행 중

---

### 선도소프트

**2021.12 ~ 2022.02** · 인턴
`Flutter` `Spring`

공간빅데이터 플랫폼 개발 회사에서 **야생동물 질병관리 시스템** 앱 개발 참여

- Flutter로 앱 최초 버전 개발 — 로그인·메인·설정·의뢰 신청·의뢰 결과 화면 담당
- 기존 Spring 웹 버전 코드에서 앱에 필요한 부분 수정, 토큰 인증 작업
- 인턴 종료 시점에 최초 버전 완성, Play Store·App Store 출시 확인

---

## Projects

### 여행파티 — 여행 동행 매칭 앱

**2023.06 ~ 2023.12** · SW마에스트로 14기 · 백엔드·인프라 (FE 1 · BE 2)
`Spring Boot` `MySQL` `AWS` `Kafka` `STOMP` `Jenkins`

혼자 여행하는 사람은 늘지만 익명 커뮤니티에서 동행을 구하다 보니 성향이 맞지 않는 문제가 잦음.
성향 기반 동행 매칭으로 이를 보완하는 앱

#### 채팅 서버 — 다중 인스턴스 메시지 전달 문제 해결

- **문제** — 채팅 서버 2대를 라운드 로빈으로 운영하자, 서로 다른 서버에 연결된 사용자끼리 메시지가 전달되지 않음
- **검토** — Redis 세션 공유 vs 외부 메시지 브로커. Redis 장애 시 세션 전체 유실 우려, 향후 숙소 결제 대행 기능의 안정성 요구로 **Kafka** 선택
- **구조** — STOMP pub/sub → Kafka Producer → Consumer가 roomId 기준 구독 주소로 전달
- **2차 문제** — 모든 인스턴스가 같은 groupId를 써서 메시지를 나눠 가짐 → 한쪽 서버의 구독자가 메시지를 받지 못함
- **해결** — 인스턴스마다 UUID groupId를 부여한 다중 컨슈머 그룹으로 모든 인스턴스가 전체 메시지 수신

#### AWS 인프라 구축

- ALB·Bastion을 제외한 전 서버를 private subnet에 배치, ALB에서 HTTPS 처리
- ALB → nginx → NLB → WAS 구조. NLB는 포트별로 API·Chat 서버 리스너 분리
- WAS 분산은 nginx 대신 NLB 사용 — 성능과 추가 설정 없는 로드밸런싱 고려
- 2개 이상 AZ로 장애 대비, ECS·ECR 기반 컨테이너 배포

#### OAuth2 소셜 로그인

- 카카오·구글·네이버·애플·인스타그램 5종, Spring Security OAuth2 기반
- Spring Boot 3 / Spring Security 6 변경으로 기존 레퍼런스와 충돌 → 공식 문서 기준으로 인증 흐름 재구성
- 가입 사용자에게 access·refresh 토큰을 쿠키로 발급해 토큰 기반 인증

[자세히 보기](/posts/project-yeohaeng-party/) · [GitHub](https://github.com/orgs/swm-nodriversomabus/repositories)

---

### MO:HEYUM — 마크다운 SNS

**2022.11 ~ 2022.12** · 부스트캠프 웹·모바일 7기 그룹 프로젝트 · 백엔드 (FE 2 · BE 2)
`NestJS` `MongoDB` `Mongoose` `Redis` `Naver Cloud Platform`

마크다운으로 글을 쓸 수 있는 SNS. 매주 파트별 담당자를 한 명씩 교체하며 전 영역 개발

#### 멘션 리스트 Redis 캐싱 — 800ms → 60ms

- **문제** — follow·following 목록을 합쳐 멘션 후보를 만드는 API. Promise.all로 병렬화했지만 사용자가 늘수록 느려지고, 글·답글 작성마다 반복 호출
- **해결** — CacheInterceptor를 상속해 `url + userId` 키로 사용자별 캐싱, 팔로우 변경 시 캐시를 지우는 데코레이터 추가
- **결과** — 두 번째 요청부터 800ms → 60ms

#### 토큰 인증

- access·refresh 토큰을 쿠키로 발급, refresh 토큰은 Redis에 만료 시간과 같은 TTL로 저장
- refresh 토큰을 호출마다 재발급(rotation)해 탈취돼도 최대 1회만 사용 가능
- 인증 절차를 Express 미들웨어 대신 Nest Guard로 분리

#### 이메일 인증

- 회원가입·비밀번호 찾기에 적용 (`@nestjs-modules/mailer`)
- 6자리 코드 발급 → 암호화 값은 쿠키, 코드는 응답으로 전달 → 서버의 salt로 대조

#### 로깅

- winston·daily-rotate-file 기반, exception filter로 예외 로깅 일원화
- production은 console 출력을 끄고 error·warn만 파일 기록
- warn 파일에 error까지 중복 기록되던 문제 → level별 format filter로 불필요한 file write 제거

[자세히 보기](/posts/project-moheyum/) · [GitHub](https://github.com/boostcampwm-2022/web34-moheyum/tree/main)

> 저장소가 속한 조직에서 보안 점검이 진행 중입니다. 점검이 끝날 때까지 코드를
> 내려받는 것은 권하지 않습니다.
{: .prompt-warning }
