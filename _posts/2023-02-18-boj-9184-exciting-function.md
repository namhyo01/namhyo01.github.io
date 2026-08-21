---
title: "[DP] 9184 - 신나는 함수 실행 (실버2) with Python"
date: 2023-02-18 02:42:45 +0900
categories: ["알고리즘", "dp"]
tags: ["dp"]
description: "입력은 세 정수 a, b, c로 이루어져 있으며, 한 줄에 하나씩 주어진다. 입력의 마지막은 -1 -1 -1로 나타내며, 세 정수가 모두 -1인 경우는 입력의 마지막을 제외하면 없다."
tistory_id: 15
---
<https://www.acmicpc.net/problem/9184>

9184번: 신나는 함수 실행

입력은 세 정수 a, b, c로 이루어져 있으며, 한 줄에 하나씩 주어진다. 입력의 마지막은 -1 -1 -1로 나타내며, 세 정수가 모두 -1인 경우는 입력의 마지막을 제외하면 없다.

www.acmicpc.net

![](/assets/img/posts/boj-9184-exciting-function-1.png)

## 주저리 주저리

문제에서 대놓고 시간이 오래 걸린다고 하고 있다.  
재귀를 빠르게 끝내는 방법인 분할 정복 or dp 중에서 고르라는 것 같은데 문제를 보니 피보나치 처럼 이전 값을 메모라이징 하는 것이 옳다 판단해 dp로 작업을 시작하였다.

### 문제 풀이

일단 w함수를 수도코드에서 파이썬에 맞게 코드를 고쳐주었다.  
그렇게 이제 dp를 만들고 메모라이징을 할려는 순간 a,b,c의 범위에 마이너스가 포함된 것을 알게 되었다. (이래서 레벨이 높았구나)  
이런 경우 여러가지 방법이 있지만 나는 마이너스값 만큼을 더해 전체 범위를 늘리는 식으로 작업을 진행하였다. (모든 수에 +50)  
이거 외에는 특별한 것이 없다고 판단된다.

다만 dp에 3차원 배열을 이용하였는데, 이거에 익숙하지 않는다면 많은 어려움이 있을 것 같다.

#### 코드

```python
import sys
input = sys.stdin.readline
dp = [[[False for _ in range(102)]for _ in range(102)]for _ in range(102)]

def prints(a,b,c,result):
    print('w(%d, %d, %d) = %d'%(a,b,c,result))
def w(a,b,c):
    if dp[a][b][c]:
        return dp[a][b][c]
    if a<=50 or b<=50 or c<=50: # 조건들도 50증가
        dp[a][b][c] = 1
        return 1
    if a>70 or b>70 or c>70: # 조건들도 50증가
        if dp[70][70][70]:
            return dp[70][70][70]
        dp[a][b][c] = w(70,70,70)
        dp[70][70][70] = dp[a][b][c]
        return dp[a][b][c]
    if a<b and b<c:
        dp[a][b][c] = w(a,b,c-1) + w(a,b-1,c-1) - w(a,b-1,c)
        return dp[a][b][c]
    dp[a][b][c] = w(a-1,b,c) + w(a-1,b-1,c) + w(a-1,b,c-1) - w(a-1,b-1,c-1)
    return dp[a][b][c]

while True:
    a,b,c = map(int, input().split())
    if a==-1 and b==-1 and c==-1: # 기저조건
        break
    prints(a,b,c,w(a+50,b+50,c+50)) # 모든 수에 50 증가
```

![](/assets/img/posts/boj-9184-exciting-function-2.png)
