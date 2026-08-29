---
title: "[LeetCode] 57. Insert Interval"
date: 2026-08-30 01:00:00 +0900
categories: ["알고리즘", "구현"]
tags: ["leetcode", "구현", "cpp"]
description: "LeetCode 를 통과했는데 로컬 테스트에서 5건 걸렸다. 채점 세트에 없던 엣지 케이스들이었다."
---

- 문제: [57. Insert Interval](https://leetcode.com/problems/insert-interval/)
- 난이도: Medium
- 언어: C++

## 문제

**서로 겹치지 않고 시작점 기준으로 정렬된** 구간 배열 `intervals` 와
새 구간 `newInterval` 이 주어진다. 새 구간을 끼워 넣되,
결과도 **정렬돼 있고 서로 겹치지 않아야** 한다 (필요하면 병합).

```
intervals = [[1,3],[6,9]], newInterval = [2,5]
-> [[1,5],[6,9]]

intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
-> [[1,2],[3,10],[12,16]]
```

### 제약 조건

```
0 <= intervals.length <= 10^4
0 <= starti <= endi <= 10^5
intervals is sorted by starti in ascending order.
```

## 접근

새로운 알고리즘을 발명할 필요가 없는 문제다.
**제약조건이 이미 많은 걸 해준다** — 정렬돼 있고, 서로 겹치지 않는다.
그러면 앞에서부터 한 번만 훑으면 된다.

기존 구간 하나를 새 구간과 비교하면 세 부류로 갈린다.

```
(1) 완전히 앞     [a,b]  [ns,ne]        e < ns
(2) 겹침          [a,--b]
                     [ns,--ne]
(3) 완전히 뒤            [ns,ne]  [a,b]  s > ne
```

- (1) 은 그대로 결과에 넣는다
- (2) 는 새 구간에 흡수시킨다 (`ns = min(...)`, `ne = max(...)`)
- (3) 을 **처음 만나는 순간** 새 구간을 결과에 넣고, 기존 것도 넣는다

## 코드

```cpp
vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
    int ns = newInterval[0], ne = newInterval[1];
    int new_insert = 0;
    vector<vector<int>> res;
    for (int i = 0; i < intervals.size(); i++){
        int s = intervals[i][0], e = intervals[i][1];
        if (e < ns) {                          // (1) 완전히 앞
            res.push_back({s, e});
            continue;
        }
        if (s <= ns && e >= ns) {              // (2) 기존이 새 구간의 시작을 품음
            ns = min(ns, s);
            ne = max(ne, e);
            new_insert = 1;
            continue;
        }
        if (new_insert != 2 && s <= ne) {      // (2) 계속 겹치는 중
            ns = min(ns, s);
            ne = max(ne, e);
            continue;
        }
        if (s > ne) {                          // (3) 완전히 뒤
            if (new_insert != 2) {
                res.push_back({ns, ne});
                new_insert = 2;
            }
            res.push_back({s, e});
            continue;
        }
    }
    if (new_insert != 2) {
        res.push_back({ns, ne});
    }
    return res;
}
```

- **시간복잡도** `O(n)`
- **공간복잡도** `O(n)` (출력)

## 처음엔 틀렸다 — 그런데 LeetCode 는 통과했다

이 글의 본론은 여기다.

처음 버전은 `new_insert` 플래그를 **"한 번이라도 병합했는가"** 로 썼다.

```cpp
if (new_insert && s > ne) { ... }   // ← 병합한 적 있을 때만
```

그러면 **아무것과도 겹치지 않는 새 구간**이 중간이나 앞에 들어가야 할 때
넣을 곳을 못 찾는다. 루프를 다 돌고 나서야 맨 뒤에 붙는다.

```
[[3,5],[8,10]] + [1,2]  ->  [[3,5],[8,10],[1,2]]
[[1,2],[5,6]] + [3,4]   ->  [[1,2],[5,6],[3,4]]
```

정렬이 깨졌다. 그런데 **LeetCode 에 제출하니 통과했다.**
저 케이스들이 채점 세트에 없었기 때문이다.

로컬 테스트 하네스에서는 5건이 걸렸다.

```
✗ 맨 앞에 삽입 [[3,5],[8,10]] + [1,2]
    받은 값: [[3,5],[8,10],[1,2]]
    문제: 시작 기준 정렬이 깨졌다
✗ 시작점이 맞닿음 [[2,4]] + [0,2]
    기대: [[0,4]]
    실제: [[0,2]]
```

### 고친 것 — 플래그의 의미를 다시 정하기

`new_insert` 가 뜻해야 하는 건 "병합했는가" 가 아니라 **"결과에 이미 넣었는가"** 였다.

```cpp
if (new_insert != 2 && s > ne) { ... }   // 아직 안 넣었으면
```

0/1/2 세 상태가 각각 **"아직 안 넣음 / 병합 중 / 넣음"** 을 뜻하게 된다.
이름은 그대로인데 의미가 바뀐 것이다.

버그의 원인이 알고리즘이 아니라 **플래그가 무엇을 뜻하는지 정하지 않은 것**이었다.
불리언 하나를 만들 때 "이게 참이면 정확히 무슨 뜻인가" 를 한 문장으로 쓸 수 있어야 한다.

## 지문을 다시 읽기

> Insert `newInterval` into `intervals` such that `intervals` is
> **still sorted in ascending order by `starti`** and still does not have
> any overlapping intervals.

`still sorted` 가 **출력 조건**이다.
제약조건에 있는 `intervals is sorted by starti` 는 입력 조건이고, 이건 별개다.

입력이 정렬돼 있으니 새 구간을 **제자리에** 끼우면 저절로 지켜진다.
맨 뒤에 붙이면 깨진다. 두 문장이 같은 얘기 같지만 다르다.

## 겹침 판정은 대칭이다

두 구간 `[a,b]`, `[c,d]` 가 겹칠 조건은 이것 하나다.

$$a \le d \quad\text{and}\quad c \le b$$

처음에 `s <= ns && e >= ns` 로 **한 방향만** 봐서 이걸 놓쳤다.

```
[[2,4]] + [0,2]  ->  [0,2]     # [2,4] 가 통째로 사라졌다. 정답은 [0,4]
```

새 구간이 기존 구간의 시작을 품는 **반대 경우**라 어느 분기도 잡지 못했다.

그리고 `[1,3]` 과 `[3,5]` 는 **겹치는 것으로 본다.**
예제 2 에서 `[4,8]` 과 `[8,10]` 이 합쳐져 `[3,10]` 이 되는 게 근거다.
부등호를 `<` 로 쓰면 여기서 틀린다.

## 측정

`n = 10^4`. 세 구현이 같은 답을 내는 것을 무작위 30000건으로 확인한 뒤 측정.

| 구현 | 전부 삼킴 | 병합 없음 |
| --- | --- | --- |
| 내 풀이 | 0.207ms | 0.393ms |
| 정석 한 번 훑기 | 0.212ms | 0.383ms |
| 정렬 후 병합 | 1.006ms | 0.668ms |

정석과 **차이가 없다.** 분기를 4개로 나눈 것과 3구간으로 나눈 것이 결국 같은 일을 한다.

"전부 붙여서 정렬한 뒤 병합" 하는 방식은 `O(n log n)` 이라 3~5배 느리지만,
제약이 `10^4` 이라 이것도 통과한다. **입력이 정렬돼 있다는 조건을 안 쓰는 대가**다.

## 구현 문제라고 쉬운 게 아니다

새 알고리즘이 필요 없다는 점에서는 구현 문제가 맞다.
그런데 정답률이 낮고, 나도 한 번 틀렸다. 어려운 건 알고리즘이 아니라 **경계 조건**이다.

- 입력이 빈 배열
- 새 구간이 전부를 삼킴
- 모든 구간보다 앞 / 뒤
- 끝점이 맞닿음 (`[1,3]` 과 `[3,5]`)
- 길이 0 구간 (`[0,0]`)

알고리즘 문제는 "관찰 → 아이디어 → 코드" 지만,
이런 문제는 **"케이스를 먼저 다 나열하고 → 코드"** 가 맞다.
위 그림 세 개를 종이에 그려놓고 시작했으면 첫 버전에서 안 틀렸을 것이다.

## 다시 볼 것

- **채점 통과가 정답 보증이 아니다.** 히든 케이스는 생각보다 성기다.
- 플래그를 만들 때 **참이면 정확히 무슨 뜻인지** 한 문장으로 정해두고 시작할 것.
- `for (int i = 0; i < intervals.size(); ...)` 는 `-Wsign-compare` 경고가 난다.

## 같이 보면 좋은 글

- [153. Find Minimum in Rotated Sorted Array](/posts/leetcode-153-find-minimum-in-rotated-sorted-array/) — 여기서도 채점 통과와 요구사항 충족이 달랐다
