---
title: "[DP] 2629 - 양팔저울(골드 3) with Python"
date: 2023-02-21 02:17:30 +0900
categories: ["알고리즘", "dp"]
tags: ["dp"]
description: "첫째 줄에는 추의 개수가 자연수로 주어진다. 추의 개수는 30 이하이다. 둘째 줄에는 추의 무게들이 자연수로 가벼운 것부터 차례로 주어진다. 같은 무게의 추가 여러 개 있을 수도 있다. 추의 무"
tistory_id: 31
---
<https://www.acmicpc.net/problem/2629>

2629번: 양팔저울

첫째 줄에는 추의 개수가 자연수로 주어진다. 추의 개수는 30 이하이다. 둘째 줄에는 추의 무게들이 자연수로 가벼운 것부터 차례로 주어진다. 같은 무게의 추가 여러 개 있을 수도 있다. 추의 무

www.acmicpc.net

## 주저리 주저리

Knapsack 문제 2탄

솔직히 평번한 배낭에 비해서 무엇이 달라졌는지 잘 못느낄 것 같다.

이게 왜 골드 5랑 3난이도의 차이인지 잘 못느끼겠는 그런 느낌...?

### 문제 해결

간단하게만 말해서 3가지만 기억하면 된다

- 추를 둘 것인가
- 추를 두지 않을 것인가
- 추를 뺄 것인가

이 3가지의 경우만 생각해서 모든 케이스를 다 넣으면 된다.

[2023.02.20 - [알고리즘/dp] - [DP] 12865 - 평범한 배낭 (골드 5) with Python](https://namhyo00.tistory.com/30)

[DP] 12865 - 평범한 배낭 (골드 5) with Python

https://www.acmicpc.net/problem/12865 12865번: 평범한 배낭 첫 줄에 물품의 수 N(1 ≤ N ≤ 100)과 준서가 버틸 수 있는 무게 K(1 ≤ K ≤ 100,000)가 주어진다. 두 번째 줄부터 N개의 줄에 거쳐 각 물건의 무게 W(1

namhyo00.tistory.com

[2023.02.19 - [알고리즘/dp] - [DP] 10844 - 쉬운 계단 수 (실버 1) with Python](https://namhyo00.tistory.com/25)

[DP] 10844 - 쉬운 계단 수 (실버 1) with Python

https://www.acmicpc.net/problem/10844 10844번: 쉬운 계단 수 첫째 줄에 정답을 1,000,000,000으로 나눈 나머지를 출력한다. www.acmicpc.net 주저리 주저리 이런 유형의 문제는 제발 꼭 풀어보자. 언젠간 크게 도움

namhyo00.tistory.com

이 문제들 처럼 모든 경우의 수를 다 구하면 된다.

이전이랑 다르게 for문을 통해서 처리를 해도 되지만 여기서는 간단하게 재귀를 돌려 계산하기로 결정하였다.

#### 코드

```python
import sys
input = sys.stdin.readline

n = int(input())
chus = list(map(int, input().split()))
m = int(input())
balls = list(map(int, input().split()))
dp = [[False for _ in range((i+1)*500+1)] for i in range(n+1)]

def dfs(cnt, weight):
    if cnt > n:
        return
    if dp[cnt][weight]:
        # 굳이 더 셀 필요가 없으니
        return 
    dp[cnt][weight] = True
    dfs(cnt+1, weight)
    dfs(cnt+1, abs(weight - chus[cnt-1]))
    dfs(cnt+1, weight + chus[cnt-1])

dfs(0,0)
for ball in balls:
    if ball > 30 * 500:
        print('N', end = ' ')
        continue
    if dp[n][ball]:
        print('Y',end = ' ')
    else:
        print('N',end=' ')
```
