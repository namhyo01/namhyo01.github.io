---
title: "[LeetCode] 39. Combination Sum"
date: 2026-08-19 21:40:00 +0900
categories: ["알고리즘", "백트래킹"]
tags: ["leetcode", "백트래킹", "go"]
description: "DP인 줄 알았는데 아니었다. '개수를 구하라'와 '목록을 구하라'가 가르는 지점."
---

- 문제: [39. Combination Sum](https://leetcode.com/problems/combination-sum/)
- 난이도: Medium
- 언어: Go

## 문제

서로 다른 정수 배열 `candidates`와 목표값 `target`이 주어진다.
합이 `target`이 되는 **모든 유일한 조합**을 반환하면 된다.

- 같은 수를 **무제한으로** 다시 골라도 된다
- 조합의 순서, 조합 안 원소의 순서는 상관없다
- 두 조합은 **어떤 수의 등장 횟수(frequency)가 다르면** 서로 다른 조합이다

마지막 문장이 중요하다. `[2,2,3]`과 `[2,3,2]`는 등장 횟수가 같으므로 **같은 조합**이다.

### 제약 조건

```
1 <= candidates.length <= 30
2 <= candidates[i] <= 40
All elements of candidates are distinct.
1 <= target <= 40
```

### 예제

```
candidates = [2,3,6,7], target = 7  ->  [[2,2,3],[7]]
candidates = [2,3,5],   target = 8  ->  [[2,2,2,2],[2,3,3],[3,5]]
candidates = [2],       target = 1  ->  []
```

## DP인 줄 알았다

처음엔 DP를 의심했다. 부분문제가 겹치는 건 사실이기 때문이다.
`target=8`을 풀다 보면 "합 5를 만드는 방법"이 여러 경로에서 반복해서 나온다.

그런데 DP가 힘을 쓰려면 조건이 하나 더 필요하다.
**부분문제의 답이 하나의 값으로 요약돼야 한다.** 개수든, 최솟값이든, 참/거짓이든.

이 문제가 요구하는 건 뭔가?

> return **a list of all unique combinations**

개수가 아니라 **목록 그 자체**다. 부분문제의 답이 "3가지"가 아니라
`[[2,2,2,2],[2,3,3],[3,5]]` 같은 덩어리다. 메모이제이션을 해도 저장하는 게 리스트라
아끼는 것보다 복사·병합 비용이 더 든다.

거의 같은 뼈대인데 요구만 다른 문제들을 나란히 놓으면 선명해진다.

| 문제 | 요구 | 접근 |
| --- | --- | --- |
| [322. Coin Change](https://leetcode.com/problems/coin-change/) | 최소 동전 **개수** | DP |
| [377. Combination Sum IV](https://leetcode.com/problems/combination-sum-iv/) | 경우의 **수** | DP |
| **39. Combination Sum** | 모든 조합의 **목록** | 백트래킹 |

셋 다 "무제한으로 골라 합을 맞춘다"는 구조는 똑같다.
**개수·최솟값이면 DP, 목록이면 백트래킹.** 이 한 줄이 이 문제에서 건진 것이다.

## 중복을 만들고 거르지 않기

진짜 함정은 여기다. 매 단계에서 후보 전체를 순회하면 `[2,3]`과 `[3,2]`가 둘 다 생긴다.
`set`에 넣어 걸러내면 답은 맞지만, 애초에 안 만드는 방법이 있다.

**뒤로만 진행하면 된다.** 인덱스 `i`를 골랐으면 다음 재귀는 `candidates[i:]`에서만 고른다.
그러면 `[2,3]`은 나오지만 `[3,2]`는 나올 수가 없다. 순열 자체가 생기지 않는다.

같은 수를 다시 고를 수 있어야 하므로 `i+1`이 아니라 `i`부터라는 점이 포인트다.

## 코드

```go
func combinationSum(candidates []int, target int) [][]int {
	var result [][]int
	slices.Sort(candidates)

	for idx := range candidates {
		recursive(candidates[idx], target, candidates[idx:], []int{candidates[idx]}, &result)
	}

	return result
}

func recursive(sum, target int, candidates []int, apply []int, res *[][]int) {
	if sum == target {
		*res = append(*res, slices.Clone(apply))
		return
	}
	if sum > target {
		return
	}
	for idx := range candidates {
		recursive(sum+candidates[idx], target, candidates[idx:], append(apply, candidates[idx]), res)
	}
}
```

## Go에서 조심할 것 — `append`와 백킹 배열

백트래킹으로 모은 결과를 저장할 때 `slices.Clone`을 쓴 이유가 있다.
Go 슬라이스는 `append`할 때 **용량이 남으면 새 배열을 만들지 않고 그 자리에 쓴다.**

```go
a := make([]int, 0, 4) // cap 4 — 여유 있음
a = append(a, 1, 2)
b := append(a, 3)
c := append(a, 4)
fmt.Println(b, c) // [1 2 4] [1 2 4]  <- b가 오염됐다
```

`c`가 `b`와 같은 칸을 덮어썼다. 그래서 재귀에서 경로를 그대로 저장하면
결과 8개가 **전부 같은 값**이 되는 참사가 난다.

```go
res = append(res, path)                // ✗ 참조만 저장
res = append(res, slices.Clone(path))  // ✓ 복사본 저장
```

탐색 중에 `cur`를 밀고 당기는 건 문제없다. **결과에 넣는 순간에만** 복사하면 된다.
복사 총량은 출력 크기에 비례하므로 복잡도에도 영향이 없다.

증상으로 진단할 수도 있다. **결과 개수는 맞는데 전부 같은 값이면** 100% 이 버그다.

Python도 같은 함정이 있다(`res.append(cur)` vs `res.append(cur[:])`).
다만 Python 리스트는 항상 참조라 **항상** 깨지는 반면, Go는 용량이 남을 때만 공유해서
**작은 입력에서 우연히 통과하다가 큰 입력에서 터진다.** 이쪽이 더 고약하다.

## 해설

- **시간복잡도** 출력 크기에 비례. 탐색 트리의 잎이 곧 답이다.
- **공간복잡도** `O(target / min(candidates))` 재귀 깊이, 출력 제외

### 측정해보니

정렬을 해놓고 **가지치기를 안 썼다.** 정렬된 배열이면 `sum + c > target`인 순간
뒤쪽은 전부 더 크니 `break`해도 되는데, 끝까지 돌고 있었다.

`[2,3,4,5,6,7,8,9]`, target=40 (조합 1690개) 기준:

| 버전 | ns/op | allocs/op |
| --- | --- | --- |
| 위 코드 | 350,612 | 7,824 |
| + 가지치기(`break`) | 196,417 | 4,676 |
| + 슬라이스 하나를 공유 | **106,572** | **1,703** |

두 가지가 각각 1.8배씩 기여했다.
`append(apply, x)`를 매 호출에 넘기면 결과는 맞지만(잎에서 `Clone`하니까)
레벨마다 재할당이 일어나 할당이 4.6배 많다.

**정렬을 했으면 가지치기까지 해야 값을 뽑는다.** 정렬만 하고 안 쓰면
`O(n log n)`만 지불한 셈이다.
