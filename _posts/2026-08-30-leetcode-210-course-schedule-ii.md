---
title: "[LeetCode] 210. Course Schedule II"
date: 2026-08-30 00:00:00 +0900
categories: ["알고리즘", "위상정렬"]
tags: ["leetcode", "위상정렬", "그래프", "cpp"]
description: "207 을 풀 때 이미 답을 만들고 있었다. 세기만 하고 버리던 걸 기록하면 끝나는 문제."
---

- 문제: [210. Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)
- 난이도: Medium
- 언어: C++

## 문제

[207. Course Schedule](/posts/leetcode-207-course-schedule/) 의 후속편이다.
`prerequisites[i] = [a, b]` 는 "a 를 들으려면 b 를 먼저" 로 똑같은데, 묻는 게 다르다.

- 207: 모든 과목을 들을 수 **있는가** → `bool`
- **210: 들어야 할 순서를 내놔라** → `vector<int>`, 불가능하면 빈 배열

**정답이 여러 개면 아무거나** 반환하면 된다.

### 제약 조건

```
1 <= numCourses <= 2000
0 <= prerequisites.length <= numCourses * (numCourses - 1)
ai != bi
All the pairs [ai, bi] are distinct.
```

207 은 간선이 5,000 개까지였는데 여기는 `n(n-1)` — n=2000 이면 **약 400만 개**다.
그리고 `ai != bi` 라 자기 자신을 선수과목으로 두는 경우가 없다.

### 예제

```
numCourses = 2, prerequisites = [[1,0]]                -> [0,1]
numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
                                                       -> [0,2,1,3]  ([0,1,2,3] 도 정답)
numCourses = 1, prerequisites = []                     -> [0]
```

## 이미 답을 만들고 있었다

207 에서 이렇게 풀었다.

```cpp
while (!q.empty()) {
    int course = q.front(); q.pop();
    count++;                          // 몇 개 걷어냈는지만 세고 버렸다
    for (int next : graph[course])
        if (--indegree[next] == 0) q.push(next);
}
return count == numCourses;
```

큐에서 꺼내던 그 순서가 **곧 답이었다.** 세고 버리는 대신 기록하면 된다.

## 코드

```cpp
vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> graph(numCourses);
    vector<int> indegree(numCourses, 0); // 각 노드의 진입

    for (const auto& p : prerequisites) {
        graph[p[1]].push_back(p[0]);
        indegree[p[0]]++; // 진입 차수 증가
    }

    queue<int> q;
    for (int i=0;i<numCourses;i++){
        if (indegree[i] == 0) { // 진입 된 적이 없는 애들은 따로 빼기
            q.push(i); // q에 추가
        }
    }
    int cnt = 0;
    vector<int> res;
    while (!q.empty()){
        int course = q.front();
        q.pop();
        res.push_back(course);        // ← 207 과 다른 건 이 한 줄
        cnt++;
        for (int i : graph[course]){
            indegree[i]--;
            if (indegree[i] == 0){
                q.push(i);
            }
        }
    }
    if (numCourses == cnt) {
        return res;
    }
    return {};
}
```

- **시간복잡도** `O(V + E)`
- **공간복잡도** `O(V + E)`

## 왜 꺼낸 순서가 곧 답인가

큐에 들어간다는 건 **그 과목의 선수과목이 전부 이미 처리됐다**는 뜻이다.
꺼내는 순간 "지금 들어도 되는" 상태이므로, 꺼낸 순서대로 나열하면
모든 선수과목 조건이 저절로 만족된다.

정답이 여러 개인 이유도 여기서 나온다. 큐에 동시에 여러 개가 들어 있으면
**어느 걸 먼저 꺼내도 상관없다.** 그래서 `queue` 대신 `stack` 을 써도,
`priority_queue` 로 사전순 최소를 뽑아도 전부 유효하다.
(사전순으로 가장 빠른 순서를 요구하는 변형 문제가 실제로 있다.)

## 정답이 여러 개면 테스트를 어떻게 짜나

이번엔 로컬 하네스 구조가 달랐다. 기댓값과 비교할 수가 없으니
**돌려받은 순서를 검증**하는 방식으로 짰다.

1. 완주 불가능한 입력이면 → 빈 배열인가
2. 길이가 `numCourses` 이고 `0..n-1` 의 **순열**인가 (중복·누락·범위 밖 없음)
3. 모든 `[a, b]` 에 대해 **`b` 의 위치가 `a` 보다 앞인가**

3번이 핵심이다. 각 과목의 위치를 `pos` 배열에 담아두면 `O(E)` 에 전부 확인된다.

```cpp
vector<int> pos(n, -1);
for (int i = 0; i < n; i++) pos[order[i]] = i;
for (auto& p : pre)
    if (pos[p[1]] > pos[p[0]]) return "선수과목 위반";
```

검증기가 실제로 동작하는지도 확인했다. 정답 순서를 일부러 뒤집어 넣으니
예제 단계에서 바로 걸렸다.

> **하네스에 참조 구현을 넣을 때 조심할 게 하나 있다.**
> 처음엔 "완주 가능한가" 판정을 위상정렬로 짜서 테스트 파일에 넣어뒀는데,
> 에디터가 워크스페이스의 다른 파일에서 단어를 끌어와 제안하는 바람에
> **풀이를 치는 동안 정답이 자동완성으로 튀어나왔다.**
> 도달 가능성 행렬(`O(n^3)`, 작은 입력 전용)로 바꿨다.
> 위상정렬과 구조가 전혀 달라서 힌트가 되지 않는다.

## 순서를 기록하는 비용은 사실상 0

`push_back` 이 붙었으니 조금은 느려지지 않을까 싶어 재봤다.
n=2000, 간선 50만. 세 구현이 같은 결과를 내는 것을 무작위 20000건으로 확인한 뒤 측정.

| 구현 | 시간 |
| --- | --- |
| 순서 쌓기 (내 풀이) | 4.336ms |
| 개수만 세기 (207 방식) | 4.394ms |
| `res.reserve(n)` 추가 | 4.294ms |

**차이가 없다.** `push_back` 은 상환 `O(1)` 이고 총 `n` 번뿐인데,
간선 50만 개를 훑는 비용이 압도적이라 묻힌다. `reserve` 도 의미가 없었다.

## 207 과 나란히 놓으면

| | 207. Course Schedule | 210. Course Schedule II |
| --- | --- | --- |
| 묻는 것 | 완주 **가능한가** | 완주 **순서** |
| 반환 | `bool` | `vector<int>` (불가능하면 빈 배열) |
| 코드 차이 | — | `res.push_back(course)` 한 줄 |
| 간선 상한 | 5,000 | `n(n-1)` ≈ 400만 |

DFS 색칠로도 풀 수 있지만 이 문제에서는 진입차수 쪽이 확실히 유리하다.
DFS 는 **후위 순회 결과를 뒤집어야** 답이 나오는데, 그 한 단계를 빠뜨리기 쉽다.
진입차수 방식은 꺼낸 순서가 그대로 답이라 뒤집을 일이 없다.

## 다시 볼 것

- `cnt` 와 `res.size()` 가 항상 같다. 하나는 없어도 된다.
  `return (int)res.size() == numCourses ? res : vector<int>{};`
- 큐를 `priority_queue` 로 바꾸면 사전순으로 가장 빠른 순서가 나온다.

## 같이 보면 좋은 글

- [207. Course Schedule](/posts/leetcode-207-course-schedule/) — 같은 알고리즘, 개수만 세는 버전
- [79. Word Search](/posts/leetcode-79-word-search/) — 그래프 탐색에서 상태를 되돌리는 이야기
