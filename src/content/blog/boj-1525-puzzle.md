---
title: '1525 - 퍼즐 with Python'
description: '세 줄에 걸쳐서 표에 채워져 있는 아홉 개의 수가 주어진다. 한 줄에 세 개의 수가 주어지며, 빈 칸은 0으로 나타낸다.'
pubDate: 2023-02-28
category: '알고리즘/bfs&dfs'
tistoryId: 54
---
<https://www.acmicpc.net/problem/1525>

1525번: 퍼즐

세 줄에 걸쳐서 표에 채워져 있는 아홉 개의 수가 주어진다. 한 줄에 세 개의 수가 주어지며, 빈 칸은 0으로 나타낸다.

www.acmicpc.net

## 주저리 주저리

오랜만에 푸는 골드 2문제

bfs문제에서 조금 머리만 유동적으로 생각하면 쉽게 풀린다.

사실 갓이썬이여서 쉽게 풀린거 같긴 하다...

### 문제 해결

평범하게 bfs를 돌리면 된다.

다만! check하는 변수를 보통 리스트형태로 사용하는데, 이번엔 딕셔너리 형태로 만들어서 사용 하면 된다.

보통 문자열이나 수학적 접근을 하는데, 굳이 이번엔 그럴 필요 없을 것 같다.

왜냐하면 파이썬으로는 딕셔너리의 key값에 현재 map을 str을 이용해 문자열로 만들 수 있기 때문이다.

#### 코드

```python
import sys
from collections import deque
from copy import deepcopy
input = sys.stdin.readline
maps = []
dx = [1,-1,0,0]
dy = [0,0,1,-1]
visited = {}
checked = [[1,2,3],[4,5,6],[7,8,0]]
for _ in range(3):
    maps.append(list(map(int, input().split()))) # 퍼즐 설정
x = y = 0
flag = False
for i in range(3):
    for j in range(3):
        if maps[i][j] == 0:
            x,y = j,i
            flag = True
            break
    if flag:
        break

def check(m):
    if checked == m:
        return True
    return False

def bfs(x,y,maps):
    map = deepcopy(maps)
    ans = 0
    queue = deque([])
    queue.append([x,y,map,0])
    while queue:
        x,y,m,cnt = queue.popleft()
        if check(m):
            return cnt
        for i in range(4):
            nx = x+dx[i]
            ny = y+dy[i]
            if 0<=nx<3 and 0<=ny<3:
                nm = deepcopy(m)
                nm[y][x],nm[ny][nx] = nm[ny][nx],0
                if not visited.get(str(nm),False):
                    visited[str(nm)] = True
                    queue.append([nx,ny,nm,cnt+1])
    return -1

visited[str(maps)] = True
print(bfs(x,y,maps))
```
