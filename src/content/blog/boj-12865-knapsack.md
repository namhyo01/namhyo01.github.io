---
title: '[DP] 12865 - 평범한 배낭 (골드 5) with Python'
description: '첫 줄에 물품의 수 N(1 ≤ N ≤ 100)과 준서가 버틸 수 있는 무게 K(1 ≤ K ≤ 100,000)가 주어진다.…'
pubDate: 2023-02-20
category: '알고리즘/dp'
tistoryId: 30
---
<https://www.acmicpc.net/problem/12865>

12865번: 평범한 배낭

첫 줄에 물품의 수 N(1 ≤ N ≤ 100)과 준서가 버틸 수 있는 무게 K(1 ≤ K ≤ 100,000)가 주어진다. 두 번째 줄부터 N개의 줄에 거쳐 각 물건의 무게 W(1 ≤ W ≤ 100,000)와 해당 물건의 가치 V(0 ≤ V ≤ 1,000)

www.acmicpc.net

## 주저리 주저리

Knapsack 문제의 대표적인 백준 문제

겁먹지 않고 dp차원으로 차근히 보면 쉽게 답이 나온다

### 문제 해결

자 DP의 대표적인 문제인 배낭 문제이다.

DP로 풀수 있게 접근을 해보자.

간단하게 물건들에 대한 정보가 나오니 그 순서대로 기록을 하는것이 나을 것 같다.

자 dp를 물건의 순서 번호와 무게로 이렇게 2차원으로 만들어보자

처음에 들어오는 값은 무게 6, 가치 13 이니 이를 어떻게 값들을 저장해야할까?

생각을 해야할게 우린 dp[n][k]를 구하는 것이 목표이다.

그러기 위해선 일단 반복문을 돌리는 것 까지는 유추 가능하다.

```python
for i in range(1, n+1):
    for j in range(1, k+1):
```

자 이제 dp에 넣어보자

생각해보자

dp[1][1] 은 첫 물건을 넣었을 때, 가방 무게가 1인 경우인데, 내가 넣을 물건의 무게는 6이다.

그 뜻은 당연히 못 들어간다는 의미가 된다. 그래서 이런 경우 이전 경우의 수를 집어 넣으면 된다는 생각이 들었다.

그럼 반대로 버틸수 있는 무게가 내가 넣을 물건 무게보다 크다면?

그럼 들어갈 수 있다는 의미가 된다.

이를 코드로 작성하면

```python
if j >= w[i-1]:
            dp[i][j] = max(dp[i-1][j], dp[i-1][j-w[i-1]]+v[i-1])
        else:
            dp[i][j] = dp[i-1][j]
```

이런식의 코드가 완성되는 것을 알 수 있다.

#### 코드

```python
import sys
input = sys.stdin.readline
n,k = map(int, input().split())
w = []
v = []
dp = [[0 for _ in range(k+1)] for _ in range(n+1)]

for _ in range(n):
    a, b = map(int, input().split())
    w.append(a)
    v.append(b)

for i in range(1, n+1):
    for j in range(1, k+1):
        if j >= w[i-1]:
            dp[i][j] = max(dp[i-1][j], dp[i-1][j-w[i-1]]+v[i-1])
        else:
            dp[i][j] = dp[i-1][j]
print(dp[n][k])
```
