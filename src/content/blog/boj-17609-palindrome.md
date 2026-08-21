---
title: '17609 - 회문 with Python'
description: '이 문제를 보자마자 그대로 문자를 뒤집어서 계산하는 것은 안 될까 싶었다.'
pubDate: 2023-03-30
category: '알고리즘/투 포인터'
tistoryId: 58
---
## 주저리 주저리

이 문제를 보자마자 그대로 문자를 뒤집어서 계산하는 것은 안 될까 싶었다.

하지만 유사 회문 덕에 모든 문자열을 탐색해야 함으로 O(n\*\*2)이 걸릴 거라 생각하고 한번 짜봤는데, 역시 시간 초과...

당연히 다른 접근으로 접근해보자

### 문제 해결

회문을 탐색하는 방법으로는 그냥 맨 앞과 맨 뒤에 포인터를 두고 만약 두개의 포인터가 가리키는 문자가 서로 같으면 한 칸씩 움직이는 아주 간단한 방법이 존재한다.

다만 여기서는 유사 회문이 존재한다.

따라서 그냥 만약 다르다! 그러면 왼쪽과 오른쪽 둘 중 한 곳만 움직이게 해서 그 다음을 체크하면 될 것이다.

한번 코드로 직접 보면 더 이해가 쉽게 간다.

#### 코드

```python
import sys
input = sys.stdin.readline
t = int(input())

# def isPalin(string):
#     ll = len(string)
#     if ll%2==0:
#         temp = string[ll//2:]
#         return string[:ll//2]==temp[::-1]
#     else:
#         temp = string[ll//2+1:]
#         return string[:ll//2]==temp[::-1]

# def isSimilarPalin(string):
#     for i in range(len(string)):
#         new_str = string[:i] + string[i+1:]
#         if isPalin(new_str):
#             return True
#     return False
# # def isSimilarPalin(string):
# #     for i in range(len(string)):
# #         new_str = string[:i] + string[i+1:]
# #         if isPalin(new_str):
# #             return True
# #     return False

# def solve(string):
#     if isPalin(string):
#         return 0
#     elif isSimilarPalin(string):
#         return 1
#     return 2

def solve(string, l, r, drop):
    while l<r:
        if string[l] == string[r]: # 같으면
            l+=1
            r-=1
        else: # 다르면
            if not drop: # 아직 버리지 않았다면
                ans = solve(string, l+1, r, True) or solve(string,l,r-1,True)
                if ans:
                    print(1)
                else:
                    print(2)
                return False
            else: # 버렸다면
                return False
    if not drop:
        print(0)
    return True

for _ in range(t):
    temp = input().strip()
    # print(solve(temp))
    solve(temp,0,len(temp)-1,False)
    
    # print(temp[:(len(temp)//2)])
    # print(temp[len(temp)//2:])
```
