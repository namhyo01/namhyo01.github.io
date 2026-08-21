---
title: '16924 - 십자가 찾기 with Python'
description: '십자가는 가운데에 ''''가 있고, 상하좌우 방향으로 모두 같은 길이의 ''''가 있는 모양이다. 십자가의 크기는 가운데를 중심으로 상하좌우 방향으로 있는 ''''의 개수이다. 십자가의 크기는 1보다 크'
pubDate: 2023-02-28
category: '알고리즘/구현'
tistoryId: 55
---
<https://www.acmicpc.net/problem/16924>

16924번: 십자가 찾기

십자가는 가운데에 '\*'가 있고, 상하좌우 방향으로 모두 같은 길이의 '\*'가 있는 모양이다. 십자가의 크기는 가운데를 중심으로 상하좌우 방향으로 있는 '\*'의 개수이다. 십자가의 크기는 1보다 크

www.acmicpc.net

## 주저리 주저리

빡 구현 + bfs문제라 판단된다.

-1 처리를 하는 것이 제일 힘든 문제라 판단된다.

### 문제 해결

bfs로 하나하나 도는 것이 관건이다.

x + dx[i] \* k 이런식으로 한칸씩 증가하면서 (+1-1)

단 한번이라도 십자가 모양에서 벗어나는 순간 바로 return을 해버리면 된다.

다만 별이 문제인데, 나는 별을 리스트로 담아둔 후(좌표 기준) 해당 좌표를 bfs로 지나가면 False로 처리를 했다.

그리고 마지막에 단 하나의 True값이 남아있으면 -1을 리턴하는 식으로 처리를 하였다.

#### 코드

```python
import sys
input = sys.stdin.readline
n,m = map(int, input().split())
maps = [list(input().strip()) for _ in range(n)]
ans = 0
dx = [1,-1,0,0]
dy = [0,0,1,-1]
answer_list = []
stars = [[False for _ in range(m)] for _ in range(n)]

def solve(x,y):
    for k in range(1,m+1):
        for i in range(4):
            nx = x + dx[i] * k
            ny = y + dy[i] * k
            if 0<=nx<n and 0<=ny<m and maps[nx][ny] == '*':
                pass
            else:
                return
        stars[x][y] = False
        answer_list.append([x+1,y+1,k])
        for i in range(4):
            nx = x + dx[i] * k
            ny = y + dy[i] * k
            stars[nx][ny] = False
        

def make_cross(x,y):
    return solve(x,y)

for i in range(n):
    for j in range(m):
        if maps[i][j] == '*':
            stars[i][j] = True

for i in range(0,n):
    for j in range(0,m):
        if(maps[i][j] == '*'):
            make_cross(i,j)
            
for i in stars:
    for j in i:
        if j:
            print(-1)
            exit(0)
            
print(len(answer_list))
for x,y,cnt in answer_list:
    print(x,y,cnt, sep=' ')
```
