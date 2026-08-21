---
title: '[BFS] 1697 - 숨바꼭질 (실버1) with Python'
description: '수빈이는 동생과 숨바꼭질을 하고 있다. 수빈이는 현재 점 N(0 ≤ N ≤ 100,000)에 있고, 동생은 점 K(0 ≤ K ≤ 100,000)에 있다. 수빈이는 걷거나 순간이동을 할 수 있다.…'
pubDate: 2023-02-19
updatedDate: 2023-02-21
category: '알고리즘/bfs&dfs'
tistoryId: 28
---
<https://www.acmicpc.net/problem/1697>

1697번: 숨바꼭질

수빈이는 동생과 숨바꼭질을 하고 있다. 수빈이는 현재 점 N(0 ≤ N ≤ 100,000)에 있고, 동생은 점 K(0 ≤ K ≤ 100,000)에 있다. 수빈이는 걷거나 순간이동을 할 수 있다. 만약, 수빈이의 위치가 X일

www.acmicpc.net

## 주저리 주저리

bfs문제에서 개인적으로 좋다고 생각하는 문제이다.

예전에 선입견이 있을 때 bfs가 그래프 탐색에만 사용되는 줄 알았는데, 이런 방식으로도 사용이 가능하다라는 것을 알게된 좋은 계기였다 생각한다.

### 문제 해결

bfs로 쉽게 풀리는 문제이다.

간단하게 큐에다가 현재 위치를 넣고, x-1, x+1 , 2\*x 위치를 계산한 후 큐에 넣고 다시 돌려주는 형태로 돌리면된다.

그렇게 된다면 당연하게도 제일 먼저 같아지는 것이 제일 빠른 시간 초가 된다.

#### 코드

```python
import sys
from collections import deque
input = sys.stdin.readline
n,k = map(int, input().split())
queue = deque([(n,0)])
visited = [False]*100001
while True:
    now, cnt = queue.popleft()
    visited[now] = True
    if now == k:
        print(cnt)
        break
    if now+1<=100000 and not visited[now+1]:
        queue.append((now+1,cnt+1))
    if now != 0:
        if now*2<=100000 and not visited[now*2]:
            queue.append((now*2,cnt+1))
        if not visited[now-1]:
            queue.append((now-1,cnt+1))
```
