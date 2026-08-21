---
title: '23032 - 서프라이즈~ with Python'
description: '맞춘 사람 43명 안에 든 행복이 든다?'
pubDate: 2023-03-30
category: '알고리즘/이분탐색'
tistoryId: 59
---
## 주저리 주저리

맞춘 사람 43명 안에 든 행복이 든다?

문제는 두 그룹을 만들고, 그 그룹들의 무게 합의 차가 제일 작게한다.

대신 그룹원들은 서로 번호가 연속되어야한다...

고민이 많이 필요한 문제였다.

### 문제 해결

일단 이 문제에선 중요한 것은 그룹을 만들고, 그 들의 스테이크의 합의 차가 제일 작게 만들어야 한다.

따라서 그룹을 만드는 것이 제일 중요하다 볼 수 있다.

생각해보자 그룹을 만드는데 겨우 2그룹만 만들것이다.

그럼 간단하게 중간을 기준으로 삼아 그룹을 나누면 된다.

즉 mid값으로 시작해 1~n까지 돌면서 mid의 왼쪽과 오른쪽으로 그룹을 나누어 주면 된다.

**여기서 중요한 점이 누적합 개념이다.**

만약 그냥 저 그룹만 나누고 sum이런 것을 이용해 합을 구하면 시간 초과이다. (당연히도)

그래서 우린 누적합 개념을 이용하자.

왼쪽 그룹 합, 오른쪽 그룹 합을 만든 후, 이들이 움직이면 추가한 값만 더해주면 된다.

**움직이는 기준은?**

만약 왼쪽의 누적합이 오른쪽 누적합보다 크면 우린 오른쪽을 움직여 오른쪽 누적합을 증가시켜야만 둘의 차가 최소가 되게 만들 수 있을 것이다.

이 개념을 이용해서 한번 풀어보자

#### 코드

```python
import sys
from bisect import bisect_left, bisect_right
from copy import deepcopy
input = sys.stdin.readline
n = int(input())
students = list(map(int, input().split()))
start = 0
e = float('inf')
steak = 0

for mid in range(1, n):
    leftSum = students[mid-1]
    rightSum = students[mid]
    left = mid-1
    right = mid
    while True:
        diff = abs(leftSum - rightSum)
        if diff == e:
            steak = max(steak, leftSum+rightSum)
        elif diff < e:
            e = diff
            steak = leftSum+rightSum
        if leftSum < rightSum: # left가 더 작으니 증가 시킨다
            if left == 0:
                break
            left -= 1
            leftSum += students[left]
        elif leftSum > rightSum:
            if right == n-1:
                break
            right += 1
            rightSum += students[right]
        else:
            if left == 0 or right == n-1:
                break
            left -= 1
            right += 1
            leftSum += students[left]
            rightSum += students[right]

print(steak)
```
