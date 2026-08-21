---
title: 'EBS'
description: 'Elastic Block Storage의 약어로'
pubDate: 2023-06-22
category: 'aws'
tistoryId: 76
---
## EBS란

Elastic Block Storage의 약어로

- 저장 공간이 생성되고 EC2 인스턴스에 부착된다
- 디스크 볼륨 위에 File System이 생성된다
- EBS는 특정 Availability Zone에 생성된다 ( 즉 설정해야 한다. )
  - Availity Zone은? (AZ)
    - 하나의 Region안에 여러개의 AZ가 존재한다
    - 그래서 한쪽 서버가 다운되도 AZ라는 백업을 통해 복구가 된다 == Disaster Recovery

![](../../assets/blog/aws-ebs-1.png)

그래서 EC2를 사용할려면 az를 설정해야한다

## EBS 볼륨 타입

### SSD

1. GP2 : 최대 10K IOPS를 지원하며 1GB당 3IOPS 속도 나옴 - 대신 가격이 조금 싸다 밑에 비하면...
2. I01 : 극도의 I/O률을 요구하는 (DB같이) 환경에서 주로 사용된다 (10K 이상의 IOPS를 보여준다)

### HDD

1. ST1 : 빅데이터 데이터웨어하우스, 로그 프로세싱에 주로 사용, 부트 볼륨으론 적합하지 않다
2. SC1(CDD HDD) : 파일 서버와 같이 드문 볼륨 점근시 주로 사용, 얘도 부트 볼륨으로는 안되나 매우매우 싸다 - 그냥 오래오래 보관하고 싶을 때 사용한다 생각하자
3. Magnetic(Standard) : 디스크 1GB당 가장 싼 비용 자랑. 얘는 부트 볼륨 가능
