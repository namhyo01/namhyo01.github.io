---
title: "[LeetCode] 105. Construct Binary Tree from Preorder and Inorder"
date: 2026-08-20 22:20:00 +0900
categories: ["알고리즘", "분할정복"]
tags: ["leetcode", "분할정복", "트리", "go"]
description: "해시맵을 쓰면 더 빠를 줄 알았는데, 재보니 최악 케이스에서만 이기고 균형 입력에서는 오히려 졌다."
---

- 문제: [105. Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
- 난이도: Medium
- 언어: Go

## 문제

어떤 이진 트리의 **전위 순회**(preorder)와 **중위 순회**(inorder) 결과가 배열로 주어진다.
원래 트리를 복원하면 된다.

### 제약 조건

```
1 <= preorder.length <= 3000
inorder.length == preorder.length
-3000 <= preorder[i], inorder[i] <= 3000
preorder and inorder consist of unique values.
```

### 예제

```
preorder = [3,9,20,15,7]
inorder  = [9,3,15,20,7]

        3
       / \
      9  20
        /  \
       15   7
```

## 접근

관찰 두 개면 끝난다.

**1. `preorder`의 첫 원소가 루트다.** 전위 순회는 루트를 가장 먼저 방문하니까.

**2. 그 루트 값을 `inorder`에서 찾으면 좌우가 갈린다.**
중위 순회는 `왼쪽 → 루트 → 오른쪽` 순이므로, `inorder`에서 루트 왼쪽에 있는 값이
전부 왼쪽 서브트리, 오른쪽에 있는 값이 전부 오른쪽 서브트리다.

```
preorder = [3, 9, 20, 15, 7]
            ^ 루트

inorder  = [9, 3, 15, 20, 7]
            ^  ^  ^^^^^^^^^
          왼쪽 루트   오른쪽
```

한 번의 위치 확인으로 문제가 **같은 모양의 부분문제 두 개**로 쪼개진다.
왼쪽 서브트리 크기를 알면 `preorder`도 같은 비율로 자를 수 있다.

이게 분할정복이다.

## `unique values` 조건이 왜 붙어 있나

제약조건에 값이 서로 다르다는 게 명시돼 있는데, 그냥 편의 조건이 아니다.

값이 중복되면 `inorder`에서 루트 위치를 특정할 수 없다. 위치가 갈리면 좌우 서브트리
크기가 달라지므로 **트리가 유일하게 결정되지 않는다.** 값이 서로 다르기 때문에
`preorder + inorder` 두 개로 트리가 하나로 정해지고, 그래서 이 문제가 성립한다.

이 성질은 테스트를 짤 때도 쓸모가 있다. 만든 트리를 다시 순회해서 입력 두 배열과
대조하기만 하면 **그것만으로 완전한 정답 검사**가 된다.

## 코드

```go
func buildTree(preorder []int, inorder []int) *TreeNode {
	var build func(preStart, preEnd, inStart, inEnd int) *TreeNode
	build = func(preStart, preEnd, inStart, inEnd int) *TreeNode {
		if preStart > preEnd || inStart > inEnd {
			return nil
		}

		rootVal := preorder[preStart]
		root := &TreeNode{Val: rootVal}

		inRootIndex := -1
		for i := inStart; i <= inEnd; i++ {
			if inorder[i] == rootVal {
				inRootIndex = i
				break
			}
		}

		leftTreeSize := inRootIndex - inStart

		root.Left = build(preStart+1, preStart+leftTreeSize, inStart, inRootIndex-1)
		root.Right = build(preStart+leftTreeSize+1, preEnd, inRootIndex+1, inEnd)

		return root
	}

	return build(0, len(preorder)-1, 0, len(inorder)-1)
}
```

인덱스 4개를 들고 다니는 게 이 문제에서 제일 틀리기 쉬운 부분이다.
`leftTreeSize`로 `preorder` 구간을 자르는 경계(`preStart+leftTreeSize`와
`preStart+leftTreeSize+1`)에서 off-by-one이 나기 쉽다.

- **시간복잡도** 최악 `O(n^2)` / 균형 `O(n log n)` — `inorder`를 매번 선형 탐색하므로
- **공간복잡도** `O(h)` 재귀 스택 (최악 `O(n)`)

## 해설 — 해시맵이 항상 이기지는 않는다

`inorder`에서 위치를 찾는 선형 탐색이 눈에 걸린다.
값→인덱스를 맵에 미리 넣어두면 `O(n)`이 되니 당연히 더 빠를 거라 생각했다.

**재보니 반쪽만 맞았다.** n=3000, 세 구현이 같은 트리를 만드는 것을 확인한 뒤 측정:

| 구현 | 치우친 트리 | 균형 트리 | allocs |
| --- | --- | --- | --- |
| 선형 탐색 (위 코드) | 1,587µs | **90µs** | 3,002 |
| 위치를 맵에 미리 저장 | **138µs** | 150µs | 3,011 |
| 맵 + preorder 커서 하나 | **129µs** | 142µs | 3,011 |

- **치우친 트리에서는 맵이 11.5배 빠르다.** 구간이 줄지 않아 선형 탐색이 매번 n에 가깝다.
- **균형 트리에서는 오히려 선형 탐색이 1.7배 빠르다.** 구간이 절반씩 줄어 탐색이 짧고,
  맵을 만드는 비용(해시 + 195KB 할당)을 회수하지 못한다.

그러니까 "맵을 쓰면 더 빠르다"는 **틀린 말**이다.
정확히는 **"최악 케이스에서만 빠르다"**.

### 그래도 코딩테스트에서는 맵을 쓴다

채점 입력에는 최악 케이스가 반드시 들어있기 때문이다.
다만 **평균적으로는 손해인 걸 알면서 최악을 방어하려고 쓰는 것**과,
그냥 "맵이 빠르니까" 쓰는 것은 다르다. 면접에서 갈리는 건 후자가 아니라 전자다.

### 이 문제의 함정 하나 더

제약이 `n <= 3000`이라 `O(n^2)`도 1.6ms면 끝난다. 즉 **시간 초과로는 안 걸린다.**
복잡도를 스스로 따져보지 않으면 그냥 통과하고 넘어가게 된다.
LeetCode를 통과했다고 최적인 건 아니라는 예시.
