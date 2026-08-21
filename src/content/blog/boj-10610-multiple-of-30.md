---
title: '그리디 - 10610 with Python'
description: '어느 날, 미르코는 우연히 길거리에서 양수 N을 보았다. 미르코는 30이란 수를 존경하기 때문에, 그는 길거리에서 찾은 수에 포함된 숫자들을 섞어 30의 배수가 되는 가장 큰 수를 만들고 싶어한'
pubDate: 2023-02-27
category: '알고리즘/그리디'
tistoryId: 52
---
<https://www.acmicpc.net/problem/10610>

10610번: 30

어느 날, 미르코는 우연히 길거리에서 양수 N을 보았다. 미르코는 30이란 수를 존경하기 때문에, 그는 길거리에서 찾은 수에 포함된 숫자들을 섞어 30의 배수가 되는 가장 큰 수를 만들고 싶어한

www.acmicpc.net

## 문제 해결

그리디로 간단히 풀리는 문제이다

30의 배수라는 것을 생각해보자

30 60 90 120 150 180 210 240 270 300 330 360 390 420 450 480 510.....

반대로 보면 이는 뒤에는 0이 꼭 들어가고 3의 배수라는 것이다.

3의 배수는 무엇인가 각 자리수의 합이 3의 배수이면 그 숫자는 3의 배수인 것이다.

즉 0이 꼭 하나 이상있어야하고 각 자리수의 합이 3의 배수인 것만 확인하면 끝이다

### 코드

```python
import sys
input = sys.stdin.readline
n = input().strip()
data = []
sum = 0
for i in n:
    sum += int(i)
    data.append(i)

if '0' in data:
    if sum%3 != 0:
        print(-1)
    else:
        data.sort(reverse=True)
        print(''.join(data))
else:
    print(-1)
```
