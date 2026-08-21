---
title: '[DP] 1932 - 정수 삼각형 (실버1) with Python'
description: '첫째 줄에 삼각형의 크기 n(1 ≤ n ≤ 500)이 주어지고, 둘째 줄부터 n+1번째 줄까지 정수 삼각형이 주어진다.'
pubDate: 2023-02-18
category: '알고리즘/dp'
tistoryId: 21
---
<https://www.acmicpc.net/problem/1932>

1932번: 정수 삼각형

첫째 줄에 삼각형의 크기 n(1 ≤ n ≤ 500)이 주어지고, 둘째 줄부터 n+1번째 줄까지 정수 삼각형이 주어진다.

www.acmicpc.net

## 주저리 주저리

순간 그래프 모양이여서 dfs로 한 단계씩 내려가는 문제인가 싶었다.\
하지만 다시 보니 내려갈 수 있는 방향이 정해져있고, 이전 값을 활용 가능하였다. => dp구나\
그럼 한번 풀어보자

### 문제 해결

간단하게 위에서부터 내려가면서 더하거나 아니면 역으로 밑에서부터 위로 올라간다\
이런 두가지 방식 중에서 선택하면 될거 같은데, 일단 나는 위에서부터 내려가기로 했다.\
여기서 중요한 점이 있다.\
맨 왼쪽과 오른쪽은 위에서 내려오는 값이 고정이다.\
그 외의 값들은 자신의 왼쪽과 오른쪽(인덱스 기준 자기 자신 인덱스와, 그 이전 인덱스) 중 하날 선택하는데, 최대가 되게 해야하니 더 큰 값으로 하면 될 거 같다.(그리디)\
그럼 코드를 작성해보자.

#### 코드

```python
import sys
input = sys.stdin.readline
n = int(input())
triangle = []
for _ in range(n):
    triangle.append(list(map(int, input().split())))
dp = [[0 for _ in range(n+1)] for _ in range(n+1)]
dp[0][0] = triangle[0][0]
for i in range(1,n):
    for j in range(i+1):
        if j==0:
            dp[i][j] += dp[i-1][j] + triangle[i][j]
            continue
        if j==i:
            dp[i][j] += dp[i-1][j-1] + triangle[i][j]

            continue
        dp[i][j] += max(dp[i-1][j-1],dp[i-1][j]) + triangle[i][j]
print(max(dp[n-1]))
```
