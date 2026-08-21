---
title: '[DP] 11052 - 카드 구배하기 (실버1) with Python'
description: '번: 카드 구매하기'
pubDate: 2023-02-18
category: '알고리즘/dp'
tistoryId: 20
---
<https://www.acmicpc.net/problem/11052>

11052번: 카드 구매하기

첫째 줄에 민규가 구매하려고 하는 카드의 개수 N이 주어진다. (1 ≤ N ≤ 1,000) 둘째 줄에는 Pi가 P1부터 PN까지 순서대로 주어진다. (1 ≤ Pi ≤ 10,000)

www.acmicpc.net

## 주저리 주저리

실버 dp문제에서 조금 고민을 하게 되었던 문제였다.\
문제의 이해에 난해가 있어서 그런듯하다.\
조금 특이하게 보통 최소값을 찾는데 최대값을 찾는 문제가 나왔다.\
뭐 그래도 이전에 풀었던 문제들이랑 큰 차이점은 없었다고 본다.

### 문제 해결

n = 1~N까지의 모든 최대값을 구하는 것이 관점 포인트라고 할 수 있다.\
i번째의 최대값은 자기 자신과 자기 자신 이전의 최대값 + 그거를 보충하는 카드 값 중 최대값이 될 것이다.\
이를 식으로 표현하자면\
dp[i] = max(dp[i], P[i-j-1] + dp[j])\
라고 볼 수 있다.

#### 코드

```python
import sys, copy
input = sys.stdin.readline
N = int(input())
P = list(map(int,input().split()))
dp = copy.deepcopy(P)
for i in range(1, N):
    for j in range(i):
        dp[i] = max(dp[i], P[i-j-1]+dp[j])
print(dp[N-1])
```
