---
title: "[LeetCode] 207. Course Schedule"
date: 2026-08-27 23:30:00 +0900
categories: ["알고리즘", "위상정렬"]
tags: ["leetcode", "위상정렬", "그래프", "cpp"]
description: "'모든 과목을 들을 수 있는가' 를 '사이클이 없는가' 로 번역하는 문제. 사이클을 찾는 대신 끝까지 걷어낼 수 있는지를 본다."
---

- 문제: [207. Course Schedule](https://leetcode.com/problems/course-schedule/)
- 난이도: Medium
- 언어: C++

## 문제

`0` 부터 `numCourses - 1` 까지 번호가 붙은 과목이 있다.
`prerequisites[i] = [a, b]` 는 **"a 를 들으려면 b 를 먼저 들어야 한다"** 는 뜻이다.

모든 과목을 다 들을 수 있으면 `true`, 아니면 `false` 를 반환한다.

### 제약 조건

```
1 <= numCourses <= 2000
0 <= prerequisites.length <= 5000
0 <= ai, bi < numCourses
All the pairs prerequisites[i] are unique.
```

### 예제

```
numCourses = 2, prerequisites = [[1,0]]        ->  true
numCourses = 2, prerequisites = [[1,0],[0,1]]  ->  false
```

두 번째가 왜 안 되는지가 이 문제의 출발점이다.
0 을 들으려면 1 이 필요하고, 1 을 들으려면 0 이 필요하다. **서로를 기다린다.**

## 문제를 다시 쓰기

선수과목 관계를 화살표로 그리면 방향그래프가 된다.
그러면 "모든 과목을 들을 수 있다" 는 이렇게 바뀐다.

> **이 그래프에 사이클이 없는가?**

여기까지 오면 문제가 다 풀린 것이나 마찬가지다. 남은 건 사이클 판정이다.

### 화살표를 어느 쪽으로 그릴 것인가

`[a, b]` = "a 를 들으려면 b 를 먼저" 다. 여기서 한 번 헷갈린다.

**`b → a`** 로 그린다. 선수과목에서 후속과목으로 향한다.
`b` 를 끝내야 `a` 로 갈 수 있으니, 진행 방향이 곧 화살표 방향이다.

```cpp
graph[p[1]].push_back(p[0]);   // b -> a
indegree[p[0]]++;              // a 에게 조건이 하나 붙었다
```

이걸 뒤집어 놓으면 답이 **그럴듯하게** 틀린다. 예제 2 같은 대칭 케이스는 통과해버려서
한참 뒤에야 알아채게 된다.

## 사이클을 찾지 말고, 걷어내 보기

사이클을 직접 추적하는 대신 이렇게 뒤집는다.

> **지금 당장 들을 수 있는 과목**부터 하나씩 걷어낸다.
> 끝까지 다 걷어내면 사이클이 없는 것이다.

"지금 당장 들을 수 있는 과목" = **진입차수가 0 인 과목** = 남은 선수과목이 없는 과목.

그 과목을 들으면, 그것을 선수로 요구하던 과목들의 조건이 하나씩 풀린다.
그러다 진입차수가 0 이 되면 그 과목도 들을 수 있게 된다.

```cpp
bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> graph(numCourses);
    vector<int> indegree(numCourses, 0); // 각 노드의 진입 차수
    for (const auto& p : prerequisites) {
        graph[p[1]].push_back(p[0]);
        indegree[p[0]]++;
    }

    queue<int> q;
    for (int i = 0; i < numCourses; ++i) {
        if (indegree[i] == 0) {
            q.push(i);
        }
    }
    int count = 0;
    while (!q.empty()) {
        int course = q.front();
        q.pop();
        count++;
        for (int nextCourse : graph[course]) {
            indegree[nextCourse]--;
            if (indegree[nextCourse] == 0) {
                q.push(nextCourse);
            }
        }
    }
    return count == numCourses;
}
```

**`count == numCourses` 가 곧 사이클 판정이다.**
사이클에 속한 과목은 진입차수가 **절대 0 이 되지 않는다.** 서로가 서로를 요구하기 때문에
아무리 걷어내도 남는다. 큐가 비었는데 안 센 과목이 있다면 그게 사이클이다.

- **시간복잡도** `O(V + E)`
- **공간복잡도** `O(V + E)`

## DFS 로 풀면 상태가 세 가지다

같은 문제를 DFS 로도 푼다. 그런데 방문 상태를 **둘이 아니라 셋**으로 나눠야 한다.

| 상태 | 의미 |
| --- | --- |
| 0 | 아직 안 봄 |
| 1 | **지금 따라가는 중** (재귀 스택에 올라와 있다) |
| 2 | 다 봤고 사이클 없었음 |

`1` 을 다시 만나면 사이클이다. 하지만 `2` 를 만나면 **그냥 건너뛰면 된다** — 이미 확인이 끝난 곳이다.

이 둘을 `visited` 하나로 합치면 어떻게 될까. `0→1`, `0→2`, `1→2` 인 다이아몬드에서
`2` 를 두 경로로 도달하는데, 사이클이 아닌데도 사이클로 오판한다.

반대로 `2` 를 아예 기억하지 않으면 (매번 방문 표시를 되돌리면) 정답은 맞지만
**같은 정점을 경로 수만큼 다시 탄다.** 층층이 쌓인 그래프에서는 이게 폭발한다.
로컬 하네스에 그 케이스를 넣어뒀더니 이렇게 걸렸다.

```
✗ 성능: 314ms — 너무 느림 (같은 정점을 여러 번 다시 타고 있을 가능성)
```

### DFS 로 짜면 이렇게 된다

```cpp
class Solution {
    vector<vector<int>> graph;
    vector<int> state;                 // 0 안 봄 / 1 지금 따라가는 중 / 2 다 봄

    // u 에서 출발해 사이클을 만나지 않으면 true
    bool dfs(int u) {
        state[u] = 1;                  // 스택에 올린다
        for (int v : graph[u]) {
            if (state[v] == 1) return false;   // 따라가던 길로 되돌아왔다 = 사이클
            if (state[v] == 0 && !dfs(v)) return false;
            // state[v] == 2 면 이미 확인이 끝난 곳이므로 그냥 건너뛴다
        }
        state[u] = 2;                  // 스택에서 내린다
        return true;
    }

public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        graph.assign(numCourses, {});
        state.assign(numCourses, 0);
        for (const auto& p : prerequisites)
            graph[p[1]].push_back(p[0]);       // b -> a (진입차수 방식과 같은 방향)

        for (int i = 0; i < numCourses; ++i)
            if (state[i] == 0 && !dfs(i)) return false;
        return true;
    }
};
```

`state[u] = 1` 로 올렸다가 `state[u] = 2` 로 내리는 게 백트래킹이다.
[79. Word Search](/posts/leetcode-79-word-search/) 에서 `board[y][x] = '#'` 했다가
되돌린 것과 같은 구조인데, 여기서는 **원래대로 되돌리는 게 아니라 `2` 로 승격**시킨다.
"다시 볼 필요 없음" 이라는 정보를 남기는 것이다.

진입차수 방식은 이 구분 자체가 필요 없다. 상태를 **정수 하나**로 관리하기 때문이다.
"지금 따라가는 중" 이라는 개념이 아예 없다.

## 세 형태를 재봤다

큐 방식(내 풀이), 색칠 DFS, 큐 대신 벡터를 스택처럼 쓰는 변형.
셋이 같은 답을 내는 것을 무작위 20000건으로 확인한 뒤 측정했다.

| 그래프 | 큐 (내 풀이) | 색칠 DFS | 벡터 스택 |
| --- | --- | --- | --- |
| n=2000, 간선 5000 (무작위 DAG) | 0.148ms | 0.135ms | 0.141ms |
| n=2000 일자 사슬 (깊이 2000) | 0.045ms | 0.047ms | 0.048ms |

**차이가 없다.** 셋 다 `O(V+E)` 이고 상수도 비슷하다.

> 처음 쟀을 때는 색칠 DFS 가 6배 빠르게 나왔다. **측정이 틀렸다.**
> DFS 쪽만 전역 벡터를 `assign` 으로 재사용하도록 짜서, 반복 측정에서 할당 비용이
> 빠져버렸던 것. 양쪽 다 호출마다 새로 만들게 고치니 차이가 사라졌다.
> 벤치마크는 조건을 맞추는 게 절반이다.

그래도 갈리는 지점이 하나 있다. **진입차수 방식은 재귀를 쓰지 않는다.**
깊이 2000 짜리 사슬에서 DFS 는 2000 단계를 내려간다. 이 문제는 제약이 작아 괜찮지만
정점이 `10^5` 급이면 스택이 터진다. 반복문으로 도는 쪽이 깊이에 안전하다.

## 어느 쪽을 쓸까

| | 진입차수 (Kahn) | DFS 색칠 |
| --- | --- | --- |
| 상태 관리 | 정수 하나 | **3단계 구분 필요** |
| 재귀 | 없음 | 그래프 깊이만큼 내려감 |
| 성능 | 0.148ms | 0.135ms (사실상 동일) |
| 덤 | 위상정렬 **순서**를 그대로 얻는다 | 사이클 **경로**를 복원하기 쉽다 |

**코딩테스트에서는 진입차수 쪽이 무난하다.** 실수할 지점이 적고 스택 깊이 걱정이 없다.
정점이 `10^5` 급인 문제에서 DFS 로 짜면 스택이 터진다.

다만 [210. Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) 처럼
**순서를 실제로 출력**해야 하는 후속 문제에서는 진입차수 방식이 큐에서 꺼낸 순서를
그대로 답으로 쓸 수 있어 더 유리하다. 이 문제 바로 다음에 풀면 좋은 짝이다.

## 다시 볼 것

- 간선 방향을 뒤집으면 답이 그럴듯하게 틀린다. `[a, b]` 에서 누가 먼저인지 한 번 더 확인할 것.
- 사이클 판정을 "찾는다" 가 아니라 **"끝까지 걷어낼 수 있는가"** 로 뒤집는 발상은
  다른 문제에서도 반복해서 나온다.

## 같이 보면 좋은 글

- [79. Word Search](/posts/leetcode-79-word-search/) — 격자 위 DFS, 방문 표시를 되돌리는 문제
- [105. Construct Binary Tree](/posts/leetcode-105-construct-binary-tree/) — 재귀로 부분문제 쪼개기
