---
title: '그리디 - 1931 회의실 배정 with Python'
description: '(1,4), (5,7), (8,11), (12,14) 를 이용할 수 있다.'
pubDate: 2023-02-27
category: '알고리즘/그리디'
tistoryId: 53
---
<https://www.acmicpc.net/problem/1931>

1931번: 회의실 배정

(1,4), (5,7), (8,11), (12,14) 를 이용할 수 있다.

www.acmicpc.net

## 문제 해결

그리디 문제 중 대표적인 문제라 생각 된다.

간단하게 생각해보자 앞의 회의실이 끝나지 않으면 뒤의 회의실은 시작하지 못한다.

즉 앞에서 끝나는 시간이 빠르면 빠를 수록 그 다음에 시작할 수 있는 애들도 많아진다로 생각해도 된다는 것이다.

자 그러면 우린 끝나는 시간을 기준으로 정렬을 한다.

이렇게 정렬 된 후 이 끝나는 시간보다 더 큰 start를 가진 제일 먼저 나오는 녀석으로 또 골라 반복하면 되는 것이다.

### 코드

```sql
import sys
input = sys.stdin.readline
n = int(input())
rooms = []
for i in range(n):
    rooms.append(list(map(int, input().split())))
rooms.sort(key=lambda x: (x[1],x[0]))
cnt = 1
start,end = rooms[0][0], rooms[0][1]
for i in range(1,n):
    if rooms[i][0] >= end:
        end = rooms[i][1]
        cnt+=1
print(cnt)
```
