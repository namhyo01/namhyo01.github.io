---
title: '[DP] 2225 - 합분해 (골드5) with Python'
description: '첫째 줄에 답을 1,000,000,000으로 나눈 나머지를 출력한다.'
pubDate: 2023-02-18
category: '알고리즘/dp'
tistoryId: 18
---
<https://www.acmicpc.net/problem/2225>

2225번: 합분해

첫째 줄에 답을 1,000,000,000으로 나눈 나머지를 출력한다.

www.acmicpc.net

## 주저리 주저리

최근 dp관련 문제를 하두 풀다 보니, 문제를 보자마자 아 이건 dp겠네? 라는 생각이 먼저 들게 되었다.

### 문제 해결

일단 문제를 보면 0부터 N까지 정수 K개를 더해 그 합이 N이 되는 개수를 구하라...\
게다가 1+2와 2+1은 서로 다른 것으로 판단한다라\
그러면 더 쉽게 생각이 가능하다 판단하였다.\
일단 dp[5][2]라고 해보자 (N=5, K=2) 즉 2개의 수로 더해 5을 만드는 경우의 수라고 생각하자\
그러면 우린 dp[0][1] dp[1][1] dp[2][1] dp[3][1] dp[4][1] dp[5][1]이 6가지의 경우를 다 더하면 모든 경우의 수가 만들어 진다.\
그걸 코드로 작성하게 되면 밑의 코드가 완성되게 된다.

#### 코드

```python
import sys
input = sys.stdin.readline
n,k = map(int, input().split())
mod = 1000000000
dp = [[0 for _ in range(201)] for _ in range(201)]
for i in range(n+1):
    dp[i][1] = 1

for i in range(1,k+1):
    for j in range(0,n+1):
        for l in range(0,j+1):
            dp[j][i] += (dp[j-l][i-1])%mod

print(dp[n][k]%mod)
```
