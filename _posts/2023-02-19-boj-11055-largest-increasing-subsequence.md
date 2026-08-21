---
title: "[DP] 11055 - 가장 큰 증가 부분 수열 (실버2) with Python"
date: 2023-02-19 19:15:25 +0900
categories: ["알고리즘", "dp"]
tags: ["dp"]
description: "수열 A가 주어졌을 때, 그 수열의 증가 부분 수열 중에서 합이 가장 큰 것을 구하는 프로그램을 작성하시오.…"
tistory_id: 27
---
<https://www.acmicpc.net/problem/11055>

11055번: 가장 큰 증가 부분 수열

수열 A가 주어졌을 때, 그 수열의 증가 부분 수열 중에서 합이 가장 큰 것을 구하는 프로그램을 작성하시오. 예를 들어, 수열 A = {1, 100, 2, 50, 60, 3, 5, 6, 7, 8} 인 경우에 합이 가장 큰 증가 부분 수

www.acmicpc.net

## 주저리 주저리

이 문제도 아래 문제랑 비슷하게 좋다고 생각한다.

[2023.02.19 - [알고리즘/dp] - [DP, 이분탐색] 11053 - 가장 긴 증가하는 부분 수열(실버 2) with Python](https://namhyo00.tistory.com/26)

[DP, 이분탐색] 11053 - 가장 긴 증가하는 부분 수열(실버 2) with Python

https://www.acmicpc.net/problem/11053 11053번: 가장 긴 증가하는 부분 수열 수열 A가 주어졌을 때, 가장 긴 증가하는 부분 수열을 구하는 프로그램을 작성하시오. 예를 들어, 수열 A = {10, 20, 10, 30, 20, 50} 인

namhyo00.tistory.com

그냥 이 시리즈는 한번쯤은 풀어보는 것이 좋을 것 같다.

### 문제 해결

일단 이것은 가장 크게 증가하는 부분수열의 최대 개수가 아닌, 증가하는 부분 수열 중에서 **합이 가장 큰 것을 구하는 것이다.**

따라서 이 문제가 전이랑 다르게 풀 필요 없이 비슷하게 접근 하면 된다.

다만 차이는 더하는 것이 개수를 더하는 +1이 아닌 그 값으로 대입하면 된다.

당연하게도 이런식의 문제 유형은 이분탐색으로 풀었던 문제처럼은 풀리지 않는다.

#### 코드

```python
import sys
input = sys.stdin.readline
n = int(input())
A = list(map(int, input().split()))
dp = [0 for _ in range(n+1)]
for i in range(n):
    dp[i] = A[i]
    for j in range(i):
        if A[i] > A[j]:
            dp[i] = max(dp[j]+A[i],dp[i])
print(max(dp))
```
