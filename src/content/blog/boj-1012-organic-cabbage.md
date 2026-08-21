---
title: '[DFS] 1012 - 유기농 배추 (실버2) with Python'
description: '차세대 영농인 한나는 강원도 고랭지에서 유기농 배추를 재배하기로 하였다. 농약을 쓰지 않고 배추를 재배하려면 배추를 해충으로부터 보호하는 것이 중요하기 때문에, 한나는 해충 방지에'
pubDate: 2023-02-18
category: '알고리즘/bfs&dfs'
tistoryId: 16
---
<https://www.acmicpc.net/problem/1012>

1012번: 유기농 배추

차세대 영농인 한나는 강원도 고랭지에서 유기농 배추를 재배하기로 하였다. 농약을 쓰지 않고 배추를 재배하려면 배추를 해충으로부터 보호하는 것이 중요하기 때문에, 한나는 해충 방지에

www.acmicpc.net

## 주저리 주저리

문제는 간단한 탐색 문제이다. 너비 탐색이던 깊이 탐색이던 문제가 없어서 깊이 탐색으로 진행하였다.\
대표적인 dfs, bfs 문제로서 한번쯤 풀어보면 좋은 문제인것 같다.

### 문제 해결

```python
import sys
input = sys.stdin.readline
T = int(input())
maps = [[False for _ in range(51)] for _ in range(51)]
dx = [1,-1,0,0]
dy = [0,0,1,-1]
def dfs(x,y,M,N,checks):
    checks[y][x] = True
    for i in range(4):
        newx = x+dx[i]
        newy = y+dy[i]
        if newx >= 0 and newy >= 0 and newx < M and newy < N and not checks[newy][newx] and maps[newy][newx]:
            dfs(newx,newy,M,N,checks)

for _ in range(T):
    x, y, k = map(int, input().split())
    checks = [[False for _ in range(51)] for _ in range(51)]
    maps = [[False for _ in range(51)] for _ in range(51)]

    cnt = 0
    for _ in range(k):
        x1, y1 = map(int, input().split())
        maps[y1][x1] = True
    for i in range(x):
        for j in range(y):
            if not checks[j][i] and maps[j][i]:
                dfs(i,j,x,y,checks)
                cnt += 1
    print(cnt)
```

### 오류 발생

그러나 이렇게 코드를 제출시 **Recursion Error**가 발생하게 된다...

#### 오류 해결

이유를 알고보니 백준에서 기본적인 재귀의 깊이가 1000이여서 그렇다고 한다\
setrecursionlimit을 설정해서 올리면 된다 한다.

#### 코드

```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**6)
T = int(input())
maps = [[False for _ in range(51)] for _ in range(51)]
dx = [1,-1,0,0]
dy = [0,0,1,-1]
def dfs(x,y,M,N,checks):
    checks[y][x] = True
    for i in range(4):
        newx = x+dx[i]
        newy = y+dy[i]
        if newx >= 0 and newy >= 0 and newx < M and newy < N and not checks[newy][newx] and maps[newy][newx]:
            dfs(newx,newy,M,N,checks)

for _ in range(T):
    x, y, k = map(int, input().split())
    checks = [[False for _ in range(51)] for _ in range(51)]
    maps = [[False for _ in range(51)] for _ in range(51)]

    cnt = 0
    for _ in range(k):
        x1, y1 = map(int, input().split())
        maps[y1][x1] = True
    for i in range(x):
        for j in range(y):
            if not checks[j][i] and maps[j][i]:
                dfs(i,j,x,y,checks)
                cnt += 1
    print(cnt)
```
