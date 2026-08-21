---
title: "[이분탐색][해시] 1920 수 찾기 (실버4) with Python"
date: 2023-02-18 01:35:57 +0900
categories: ["알고리즘", "이분탐색"]
tags: ["이분탐색"]
description: "첫째 줄에 자연수 N(1 ≤ N ≤ 100,000)이 주어진다. 다음 줄에는 N개의 정수 A[1], A[2], …, A[N]이 주어진다. 다음 줄에는 M(1 ≤ M ≤ 100,000)이 주어진다.…"
tistory_id: 13
---
<https://www.acmicpc.net/problem/1920>

1920번: 수 찾기

첫째 줄에 자연수 N(1 ≤ N ≤ 100,000)이 주어진다. 다음 줄에는 N개의 정수 A[1], A[2], …, A[N]이 주어진다. 다음 줄에는 M(1 ≤ M ≤ 100,000)이 주어진다. 다음 줄에는 M개의 수들이 주어지는데, 이 수들

www.acmicpc.net

## 주저리 설명

문제는 간단하다.  
A라는 배열을 주고 M이라는 배열을 주어 M의 배열 숫자 중 A의 배열에 들어가 있는것이 있는가? 이것이 문제이다.  
문제는 시간 초이다. N이 십만, M이 십만 순전히 이를 다 찾는 다면 걸리는 시간은 O(n^2) 이러면 1초내로 실행이 될 거라 판단 되지 않는다.  
따라서 문제에서 요구하는 것은 시간을 어떻게 줄일 것인가.  
문제에서 요구하는 것을 보니, **이분탐색** 이라는 키워드가 힌트였다. (나는 처음에 다르게 풀었다.)  
사실 생각해보니 정렬에 O(nlogn) BS에 O(logn)으로 O(nlog^2n)으로 찾는 다고 한다면 시간내로 가능하다는 판단이 되었다.

#### BS 코드

```python
import sys
input = sys.stdin.readline

n = int(input())
A = list(map(int, input().split()))
A.sort()
m = int(input())
M = list(map(int, input().split()))
def bs(data,start,end):
    if start>end:
        return 0
    m = (start+end)//2
    if data == A[m]:
        return 1
    if data < A[m]:
        return bs(data, start, m-1)
    if data > A[m]:
        return bs(data,m+1,end)
for i in M:
    print(bs(i,0,n-1))
```

간단하게 이리 작성해서 제출을 한 결과 정답으로 나왔다. 이를 좀 더 개선할 수는 없을까?  
파이썬에는 c++처럼 이진 검색을 위한 모듈이 만들어져 있다.

```
bisect라는 모듈!
```

이 모듈의 사용법에 익숙해 질겸 한번 사용해 보았다.

#### bisect 코드

```python
import sys
from bisect import bisect_left
input = sys.stdin.readline

n = int(input())
A = list(map(int, input().split()))
A.sort()
m = int(input())
M = list(map(int, input().split()))
def bs(data,start,end):
    if start>end:
        return 0
    m = (start+end)//2
    if data == A[m]:
        return 1
    if data < A[m]:
        return bs(data, start, m-1)
    if data > A[m]:
        return bs(data,m+1,end)
for i in M:
    temp = bisect_left(A,i)
    if temp < n and A[temp] == i:
        print(1)
    else:
        print(0)
```

그 결과는?

![](/assets/img/posts/boj-1920-number-search-1.png)
_위가 bisect_

시간이 개선된 것을 확인 가능하였다.

### 원래 푼 코드는?

나는 처음에 풀었을 때 문제를 보자마자 해시맵이면 간단하겠구나 라는 생각으로 문제를 풀었다.  
파이썬의 딕셔너리를 활용하여 문제를 해결하였고, get이라는 메소드가 정말 유용하게 사용되었다.

```python
import sys
input = sys.stdin.readline

n = int(input())
A = list(map(int, input().split()))
m = int(input())
A_dict = {x:1 for x in A}
M = list(map(int, input().split()))
for i in M:
    print(A_dict.get(i,0))
```

get이라는 메소드는 파이썬에서 딕셔너리에서 key값에 없는 데이터를 가져올려고 하면 에러가 나 예외 처리를 해야하는데, get 메소드를 사용한다면key값이 없을시 뒤에있는 default값으로 대체를 해준다.  
그래서 key값이 있으면 1, 없으면 0을 반환한다!
