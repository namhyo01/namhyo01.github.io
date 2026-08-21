---
title: "[Baekjoon - 22862] 가장 긴 짝수 연속한 부분 수열 (large) with Python"
date: 2023-04-25 11:05:02 +0900
categories: ["알고리즘", "투 포인터"]
tags: ["투 포인터"]
description: "투 포인터 문제 중 대표적인 문제 중 하나라고 생각한다."
tistory_id: 61
---
## 주저리 주저리

투 포인터 문제 중 대표적인 문제 중 하나라고 생각한다.

이런 유형의 문제는 꼭 풀어봐야 생각하는게, 만약 코테에 이런 문제가 나올 시 이것이 투포인터 인지 아닌지 애매해서 못 풀수도 있을 거 같다라는 생각을 든다.

다들 알다시피 투 포인터는 대충 두 점을 같은 위치에서 시작하느냐 or 양 끝으로 시작하느냐의 문제가 대부분인 듯 하다.

난 개인적으로 같은 위치에서 시작을 하는 경우는 이제 특정 조건에 만족하는 길이를 구할때의 문제에 적용하고, 양 끝은 이제 양 끝에서 부터 접근해서 풀면 쉬울것 같다(?) 라고 판단시에 푸는 듯 한다.

### 문제 해결

이 문제는 k개의 원소를 지워 가장 긴 짝수 의 수열을 만드는 것이다.

그럼 당연하게도... 지우는 원소는 뭐가 되겠는가 => **홀수다**

그래서 이 문제는 양끝에서부터 해도 되지만 두 위치를 같이 **시작해서 홀수가 k개 초과하면 left를 증가, 이하면 right 증가**

이 방법으로 문제를 풀면 아주 쉽게 풀린다.

그럼 길이는? => right - left - (수열 내 홀수 개수) => 로 구할수 있을 것이다.

#### 코드

```python
import sys
input = sys.stdin.readline
n,k = map(int, input().split())
S = list(map(int, input().split()))

left = right = 0
'''
    짝수 연속
    둘다 하나씩 움직이면서 계산
    두 사이 안의 홀수가 k개라면 다음으로 right만 이동
    넘어가면 left가 홀수가 나올떄까지 이동
'''
cnt = length = 0

while right < n:
    if cnt > k: # 홀수의 개수가 k개보다 커진다면
        # 그럼 left에서 계속해서 증가한다 
        if S[left] % 2 == 1:# 홀수이면
            cnt -= 1
        left += 1
        continue
    else: # cnt가 k랑 같거나 작다면
        if S[right] % 2 == 1:
            cnt += 1
        right += 1
    length = max(length, right-left-cnt)
print(length)
```
