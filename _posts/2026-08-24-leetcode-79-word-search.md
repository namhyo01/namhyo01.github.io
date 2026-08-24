---
title: "[LeetCode] 79. Word Search"
date: 2026-08-24 22:40:00 +0900
categories: ["알고리즘", "백트래킹"]
tags: ["leetcode", "백트래킹", "cpp"]
description: "격자를 공유 상태로 쓰는 백트래킹. 표시보다 '되돌리기'가 핵심이고, std::function 으로 재귀하면 1.8배 느려진다."
---

- 문제: [79. Word Search](https://leetcode.com/problems/word-search/)
- 난이도: Medium
- 언어: C++

## 문제

`m x n` 문자 격자 `board` 와 문자열 `word` 가 주어진다.
격자에서 `word` 를 만들 수 있으면 `true` 를 반환한다.

- 글자는 **상하좌우로 인접한 칸**을 순서대로 이어서 만든다
- **같은 칸을 두 번 쓸 수 없다**

### 제약 조건

```
m == board.length
n == board[i].length
1 <= m, n <= 6
1 <= word.length <= 15
board and word consists of only lowercase and uppercase English letters.
```

### 예제

```
board = [["A","B","C","E"],
         ["S","F","C","S"],
         ["A","D","E","E"]]

word = "ABCCED"  ->  true
word = "SEE"     ->  true
word = "ABCB"    ->  false
```

`"ABCB"` 가 `false` 인 게 이 문제의 전부다. 글자는 보드에 다 있다.
`A(0,0) → B(0,1) → C(0,2)` 까지 간 다음 마지막 `B` 를 찾아야 하는데,
`C(0,2)` 의 이웃 중 `B` 는 방금 지나온 `(0,1)` 뿐이다. **같은 칸은 못 쓴다.**

## 접근

모든 칸을 시작점으로 삼아 DFS 를 돌린다. 현재 칸이 `word[idx]` 와 맞으면 네 방향으로 뻗고,
아니면 즉시 실패로 되돌아온다.

문제는 **"이미 쓴 칸"을 어떻게 기억하느냐**다. 별도 `visited` 배열을 두는 방법도 있지만,
보드에 직접 표시를 남기는 쪽이 간결하다.

```cpp
char temp = board[y][x];
board[y][x] = '#';              // 이 경로에서는 다시 못 쓴다
for (int i = 0; i < 4; ++i)
    if (dfs(y+dy[i], x+dx[i], idx+1)) { board[y][x] = temp; return true; }
board[y][x] = temp;             // 복원
return false;
```

## 표시보다 복원이 핵심이다

"같은 칸을 두 번 쓸 수 없다" 는 조건은 **한 경로 안에서만** 유효하다.
경로 A 에서 쓴 칸을 경로 B 에서는 다시 쓸 수 있어야 한다.

복원을 빠뜨리면 첫 번째 경로가 보드를 영구히 오염시켜서, 뒤따르는 탐색이 전부 실패한다.
그런데 이 버그는 **작은 예제에서는 우연히 통과하는 일이 많아서** 알아채기 어렵다.

그래서 로컬 테스트 하네스에 검사를 하나 넣어뒀다. **함수를 부른 뒤 보드가 원래대로
돌아왔는지 확인**하는 것이다. 복원을 빠뜨리면 답이 맞아도 여기서 걸린다.

```
✗ 예제1 word="ABCCED" — 보드가 변형된 채로 남았다 (표시한 칸을 되돌리지 않았다)
```

답이 맞느냐와 별개로, 인자로 받은 보드를 몰래 망가뜨리고 반환하는 함수는 그 자체로 버그다.

## 39번과 비교하면 선명하다

며칠 전에 푼 [39. Combination Sum](/posts/leetcode-39-combination-sum/) 도 백트래킹이었다.
둘 다 "뻗어보고 아니면 되돌아온다" 인데, **되돌리는 대상이 다르다.**

| 문제 | 되돌리는 상태 | 방법 |
| --- | --- | --- |
| 39. Combination Sum | 지금까지 고른 수의 목록 (내 것) | `cur.pop_back()` |
| **79. Word Search** | 격자 자체 (**모두가 공유**) | `board[y][x] = temp` |

39 는 내가 들고 다니는 경로를 되돌리면 그만이다.
79 는 **다음 탐색들이 같이 쓰는 격자**를 되돌린다. 안 되돌리면 남의 탐색까지 망가뜨린다.

공유 자원을 건드렸다 되돌리는 쪽이 훨씬 실수하기 쉽다.

## `std::function` 으로 재귀하지 말 것

재귀 람다를 이렇게 잡았다.

```cpp
function<bool(int,int,int)> dfs = [&](int y, int x, int idx) { ... };
```

람다는 자기 자신을 이름으로 부를 수 없어서, 재귀하려면 흔히 `std::function` 에 담는다.
동작은 한다. 그런데 **느리다.**

같은 로직을 멤버 함수로 옮겨서 재봤다 (무작위 3000건에서 두 구현의 답이 같은 것도 확인).

| 구현 | 최악 케이스 (6x6 전부 `'a'`, 못 찾는 단어) |
| --- | --- |
| `std::function` 재귀 | 36.4ms |
| 멤버 함수 재귀 | **20.3ms** |

**1.8배**다. `std::function` 은 **타입 소거**를 하기 때문에 호출마다 간접 분기가 생기고
인라인이 막힌다. 평소에는 무시할 수준이지만, 이 문제처럼 수백만 번 재귀하는
핫패스에서는 그대로 드러난다.

대안은 두 가지다.

```cpp
// 1) 멤버 함수로 뺀다
class Solution {
    bool dfs(int y, int x, int idx) { ... }   // 상태는 멤버로
public:
    bool exist(...) { ... }
};

// 2) C++23 이면 deducing this 로 람다가 자기를 부를 수 있다
auto dfs = [&](this auto&& self, int y, int x, int idx) -> bool {
    ... self(y+1, x, idx+1) ...
};
```

## 다시 볼 것

- `-Wsign-compare` 경고가 5개 났다. `idx == word.size()`, `i < board.size()` 처럼
  `int` 와 `size_t` 를 비교한 것. 이 문제에선 무해하지만 감소 루프였다면
  `i >= 0` 이 영원히 참이 되어 무한 루프가 된다.
- `board[y][x] = temp;` 가 두 곳에 중복돼 있다. 루프에서 `break` 하고 한 번만 복원하면 된다.

## 같이 보면 좋은 글

- [39. Combination Sum](/posts/leetcode-39-combination-sum/) — 같은 백트래킹, 다른 되돌리기
- [105. Construct Binary Tree](/posts/leetcode-105-construct-binary-tree/) — 재귀로 부분문제 쪼개기
