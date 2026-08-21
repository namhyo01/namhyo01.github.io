---
title: "[DP, 이분탐색] 11053 - 가장 긴 증가하는 부분 수열(실버 2) with Python"
date: 2023-02-19 02:02:49 +0900
categories: ["알고리즘", "dp"]
tags: ["dp"]
description: "수열 A가 주어졌을 때, 가장 긴 증가하는 부분 수열을 구하는 프로그램을 작성하시오. 예를 들어, 수열 A = {10, 20, 10, 30, 20,…"
tistory_id: 26
---
<https://www.acmicpc.net/problem/11053>

11053번: 가장 긴 증가하는 부분 수열

수열 A가 주어졌을 때, 가장 긴 증가하는 부분 수열을 구하는 프로그램을 작성하시오. 예를 들어, 수열 A = {10, 20, 10, 30, 20, 50} 인 경우에 가장 긴 증가하는 부분 수열은 A = {10, 20, 10, 30, 20, 50} 이

www.acmicpc.net

<https://www.acmicpc.net/problem/12015>

12015번: 가장 긴 증가하는 부분 수열 2

첫째 줄에 수열 A의 크기 N (1 ≤ N ≤ 1,000,000)이 주어진다. 둘째 줄에는 수열 A를 이루고 있는 Ai가 주어진다. (1 ≤ Ai ≤ 1,000,000)

www.acmicpc.net

## 주저리 주저리

이 문제는 참 시리즈가 많다. 심지어 골드 이상의 난이도도 있다고 한다.

일단 이런 문제는 개인적으로 한번쯤 도전해보는 것은 좋다고 생각한다. (생각보다 재밌기도 하고...)

일단 이거랑 제일 그나마 난이도가 비슷한 골드2의 난이도인 12015랑 같이 보면 좋을 것 같아 준비했다

(사실 그 이상의 난이도의 문제가 필요한가 싶기도 해서...)

### 문제 해결

일단 DP라고 생각해보자.

너무 간단하게도 예를들어 i번째 인덱스의 값을 기준으로 dp를 기억하는 방법은 i번째 미만의 모든 값들이랑 비교하면서 A[i]보다 작은 값이 있을시 그 dp값에 +1을 해서 더 최대값을 가져오면 된다.

다만 이렇게 할 시 시간 복잡도는 O(n^2)이 되게 된다. (물론 더 적겠지만)

그런데 12015 문제를 보면 훨씬 더 큰 n값이 나오게 된다. 즉 이런 시간복잡도로는 어림도 없지 암.

그래서 나온 방법이 이분 탐색이다.

자 예를들어 빈 리스트 하나를 만들고, 일단 안에가 텅 비었거나 아니면 그 리스트 안의 제일 큰 값보다 지금 비교할 데이터가 더 클 때만 추가를 한다.

만약 제일 큰 데이터보다 지금 비교할 데이터가 더 작으면?

이제 이분탐색을 이용하는 것이다.

이분탐색을 이용해 해당 위치에 더 작은 값을 배치하는 것이다.

그렇게 할시 시간 복잡도는 O(nlogn)으로 떨어지게 되므로 훨씬 더 빠르다 할 수 있다.

#### 코드

```python
import sys
input = sys.stdin.readline

n = int(input())
A = list(map(int, input().split()))

dp = [1 for _ in range(n+1)]
for i in range(1,n):
    for j in range(i):
        if A[i] > A[j]:
            dp[i] = max(dp[i], dp[j]+1)
print(max(dp))
```

- 이분탐색

```python
from bisect import bisect_left
import sys
input = sys.stdin.readline

n = int(input())
A = list(map(int, input().split()))

data = []
for i in range(n):
    if len(data)==0 or data[-1] < A[i]:
        data.append(A[i])
        continue
    if data[-1] > A[i]:
        temp = bisect_left(data,A[i])
        data[temp] = A[i]
print(len(data))
```
