---
title: "[LeetCode] 53. Maximum Subarray"
date: 2026-08-22 14:50:00 +0900
categories: ["알고리즘", "dp"]
tags: ["leetcode", "dp", "cpp"]
description: "dp[i] 를 'i 까지의 최대 합'이 아니라 'i 에서 끝나는 최대 합'으로 잡아야 점화식이 선다. 그 차이가 전부인 문제."
---

- 문제: [53. Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)
- 난이도: Medium
- 언어: C++

## 문제

정수 배열 `nums` 에서 **연속된 부분배열** 중 합이 가장 큰 것을 찾아 그 합을 반환한다.

> **subarray** 는 배열 안에서 **연속된, 비어 있지 않은** 원소 나열이다.

지문이 이 정의를 굳이 인용문으로 빼놓은 데는 이유가 있다.
연속이라는 조건 때문에 "음수를 빼고 양수만 고르기" 가 불가능하고,
비어 있지 않다는 조건 때문에 **전부 음수인 배열의 답이 0 이 아니다.**

### 제약 조건

```
1 <= nums.length <= 10^5
-10^4 <= nums[i] <= 10^4
```

### 예제

```
nums = [-2,1,-3,4,-1,2,1,-5,4]  ->  6     ([4,-1,2,1])
nums = [1]                      ->  1
nums = [5,4,-1,7,8]             ->  23    (전체)
```

## 접근

모든 부분배열을 확인하면 `n(n+1)/2` 개다. `n = 10^5` 이면 50억 개라 안 된다.
한 번만 훑어서 끝내야 한다.

### `dp[i]` 를 무엇으로 잡을 것인가

여기가 이 문제의 전부다. 자연스럽게 떠오르는 건 이쪽이다.

> `dp[i]` = `nums[0..i]` 범위에서의 최대 부분배열 합

그런데 이렇게 잡으면 **점화식이 서지 않는다.** `dp[i-1]` 이 어디서 끝나는 덩어리인지
모르기 때문에, `nums[i]` 를 거기에 이어붙일 수 있는지 판단할 수가 없다.

그래서 이렇게 잡는다.

> `dp[i]` = **`i` 에서 끝나는** 부분배열 중 최대 합

이러면 `dp[i-1]` 이 `i-1` 에서 끝난다는 게 보장되므로, `nums[i]` 를 바로 이어붙일 수 있다.

$$dp[i] = \max(nums[i],\; dp[i-1] + nums[i])$$

앞 덩어리를 이어붙이는 게 이득이면 잇고, 아니면 `i` 에서 새로 시작한다.

**답은 `dp[n-1]` 이 아니라 `dp` 전체의 최댓값이다.** 최대 부분배열이 어디서 끝나는지
모르기 때문이다. `dp` 의 정의를 "i 에서 끝나는" 으로 좁힌 대가다.

## 코드

```cpp
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        vector<int> dp(nums.size());
        dp[0] = nums[0];
        for (size_t i = 1; i < nums.size(); ++i) {
            if (dp[i-1] + nums[i] > nums[i]) {
                dp[i] = dp[i-1] + nums[i];
            } else {
                dp[i] = nums[i];
            }
        }
        return *max_element(dp.begin(), dp.end());
    }
};
```

- **시간복잡도** `O(n)`
- **공간복잡도** `O(n)` — dp 배열

## 해설

### 왜 DP 인가 — 백트래킹 문제와 비교하면 선명하다

며칠 전에 푼 [39. Combination Sum](/posts/leetcode-39-combination-sum/) 에서는
DP 를 의심했다가 아니었다. 이번엔 진짜 DP 다. 갈리는 지점은 하나다.

> 부분문제의 답이 **하나의 값으로 요약되는가?**

| 문제 | 부분문제의 답 | 접근 |
| --- | --- | --- |
| 39. Combination Sum | 조합의 **목록** (덩어리) | 백트래킹 |
| **53. Maximum Subarray** | i 에서 끝나는 최대 합 (**정수 하나**) | DP |

부분문제가 겹치는 것만으로는 DP 가 되지 않는다. 39 번도 부분문제는 겹쳤다.
답이 값 하나로 요약돼야 메모이제이션에 의미가 생긴다.

### 조건식은 더 짧아진다

```cpp
if (dp[i-1] + nums[i] > nums[i])
```

양변에서 `nums[i]` 를 지우면 그냥 이거다.

```cpp
if (dp[i-1] > 0)
```

"앞 덩어리가 플러스면 이어붙인다" 는 의미가 그대로 드러난다.
같은 코드지만 읽는 사람이 의도를 바로 본다.

### dp 배열은 없어도 된다

`dp[i]` 는 `dp[i-1]` 만 참조한다. 배열 전체를 들고 있을 이유가 없다.
`n = 10^5` 에서 재봤다 (두 구현의 답이 같은 것도 확인했다).

| 구현 | 시간 | 추가 메모리 |
| --- | --- | --- |
| dp 배열 + `max_element` | 0.106ms | **390KB** |
| 값 하나만 굴리기 | 0.074ms | 0 |

1.4 배 차이에 공간이 `O(n)` → `O(1)` 이 된다.
**"직전 것만 참조하는 DP 는 배열을 걷어낼 수 있다"** 는 DP 문제에서 반복해서 나오는
패턴이라 손에 익혀둘 만하다.

### C++ 로 옮기면서 만난 것

`-Wall -Wextra` 로 빌드하니 경고가 났다.

```
warning: comparison of integer expressions of different signedness:
         'int' and 'std::vector<int>::size_type' [-Wsign-compare]
   for (int i = 1; i < nums.size(); ++i)
```

`vector::size()` 가 부호 없는 `size_t` 를 돌려주기 때문에, `int` 와 비교할 때
`int` 가 부호 없는 쪽으로 승격된다. 이 문제에서는 `i` 가 음수가 될 일이 없어 무해하지만,
`i` 를 감소시키는 루프였다면 `i >= 0` 이 영원히 참이 되어 무한 루프가 된다.
`size_t i` 를 쓰거나 `(int)nums.size()` 로 캐스팅한다.

Go 에서는 `len()` 이 `int` 를 돌려줘서 겪을 일이 없던 문제다.

### 디버그 출력을 풀이 함수 안에 두지 말 것

벡터를 찍어보려고 `operator<<` 를 만들어 풀이 안에서 `cout << nums` 를 했더니,
테스트 하네스가 잰 시간이 **5ms** 로 나왔다. 실제 계산은 `0.1ms` 인데 나머지가 전부 출력이었다.

성능을 측정하는 코드가 있다면 출력은 측정 구간 밖으로 빼야 한다.
실험은 `main()` 놀이터에서 하고 풀이 함수는 깨끗하게 둔다.

## 같이 보면 좋은 글

- [39. Combination Sum](/posts/leetcode-39-combination-sum/) — 부분문제가 겹쳐도 DP 가 아닌 경우
- [875. Koko Eating Bananas](/posts/leetcode-875-koko-eating-bananas/) — 답의 후보 범위를 이분탐색
- [15. 3Sum](/posts/leetcode-15-3sum/) — 쪼갠 뒤 부분문제의 최적 복잡도를 따지기
