---
title: "[DP] 2579 - 계단 오르기 (실버 3) with Python"
date: 2023-02-19 01:34:30 +0900
categories: ["알고리즘", "dp"]
tags: ["dp"]
description: "계단 오르기 게임은 계단 아래 시작점부터 계단 꼭대기에 위치한 도착점까지 가는 게임이다. 과 같이 각각의 계단에는 일정한 점수가 쓰여 있는데 계단을 밟으면 그 계단에 쓰여 있는 점"
tistory_id: 22
---
<https://www.acmicpc.net/problem/2579>

2579번: 계단 오르기

계단 오르기 게임은 계단 아래 시작점부터 계단 꼭대기에 위치한 도착점까지 가는 게임이다. <그림 1>과 같이 각각의 계단에는 일정한 점수가 쓰여 있는데 계단을 밟으면 그 계단에 쓰여 있는 점

www.acmicpc.net

## 주저리 주저리

이번 문제는 생각보다 조건이 까다로운데 난이도는 낮았다.  
솔직하게 말해서 이 문제의 난이도가 다른 실버1이나 골드5정도보다 높다 생각한다  
개인적으로 푸는데 어려웠고, 얻어가는것이 많아졌다.

### 미션 해결

![](/assets/img/posts/boj-2579-stair-climbing-1.png)

조건을 보자

![](/assets/img/posts/boj-2579-stair-climbing-2.png)

1. 계단은 한 계단 or 두 계단 건널 수 있다.
2. 연속된 세 계단은 안된다
3. 마지막은 반드시 밟자 => 딱히 무의미
   여기서 어려운 점은 1번과 2번이다.
   특히 2번을 어떻게 해결해야 하는 것이 이 문제의 특징이다.
   일단 첫 계단은 무조건 한 계단일 것이다.
   두번째 계단은 당연하게도 두개의 계단을 건너는게 최대일 것이다.
   세번째 계단은 첫 계단과 세번째 계단 or 두번째 계단과 세번째 계단 이렇게 둘 중 하나일 것이다.
   문제는 4번째 계단부터이다.
   4번째 계단이라 가정해보자, 그럼 이 경우는 어떻게 셀 것인가
   2번째 조건에 맞춰서 생각해보자
   일단 4번째 계단은 무조건 가야하니, 만약에 세번째 계단도 갔다고 가정하면 우리는 2번째 계단에는 절대 가면 안된다.
   만약에 세번째 계단은 안 갔다라 가정한다면, 당연하게도 2번째 까지의 계단은 갔다 라고 판단 가능하다.
   즉 이를 식으로 짜면
   dp[i] = max(dp[i-3] + stairs[i-1] + stairs[i], dp[i-2] + stairs[i]) 라 생각 가능하다.

#### 코드

```python
import sys
input = sys.stdin.readline
n = int(input())
stairs = [0 for _ in range(301)]
for i in range(n):
    stairs[i] = int(input())
dp = [0 for _ in range(301)]
dp[0] = stairs[0]
dp[1] = stairs[0] + stairs[1]
dp[2] = max(stairs[0]+stairs[2],stairs[1]+stairs[2])
for i in range(3,n):
    dp[i] = max(dp[i-2] + stairs[i], dp[i-3] + stairs[i-1]+ stairs[i])

print(dp[n-1])
```
