---
title: "cAdvisor - failed to get containers \"/\"..."
date: 2023-04-30 12:43:02 +0900
categories: ["CICD", "Docker"]
tags: ["Docker"]
description: "따배도를 보면서 실습을 하던 도중, 마지막 cAdvisor파트에서 이슈가 터졌었다."
tistory_id: 64
---
<https://www.youtube.com/watch?v=TM3DvwwvsLg&list=PLApuRlvrZKogb78kKq1wRvrjg1VMwYrvi&index=18>

<iframe class="video" src="https://www.youtube.com/embed/TM3DvwwvsLg" title="YouTube" loading="lazy" allowfullscreen></iframe>

따배도를 보면서 실습을 하던 도중, 마지막 cAdvisor파트에서 이슈가 터졌었다.

cAdvisor의 깃허브에 있는 readme.md에 있는 그대로 복사해 넣으면 cAdvisor컨테이너가 다운받아 돌아간다라는 말에 실행을 해 보았다

```bash
VERSION=v0.36.0 # use the latest release version from https://github.com/google/cadvisor/releases
sudo docker run \
  --volume=/:/rootfs:ro \
  --volume=/var/run:/var/run:ro \
  --volume=/sys:/sys:ro \
  --volume=/var/lib/docker/:/var/lib/docker:ro \
  --volume=/dev/disk/:/dev/disk:ro \
  --publish=8080:8080 \
  --detach=true \
  --name=cadvisor \
  --privileged \
  --device=/dev/kmsg \
  gcr.io/cadvisor/cadvisor:$VERSION
```

설치도 정상적 깔리는 것도 정상적으로 되었으나....

![](/assets/img/posts/cadvisor-failed-to-get-containers-1.png)

정작 사이트에 가보니

**failed to get container "/" with error: unable to find data in memory cache**

이런 오류를 보았다...

결국 관련해서 찾아보던 도중

<https://stackoverflow.com/questions/72754039/failed-to-get-containers-in-cadvisor-docker>

Failed to get containers "/" in cAdvisor Docker

I runned cadvisor docker with this command docker run \\ --volume=/:/rootfs:ro \\ --volume=/var/run:/var/run:rw \\ --volume=/sys:/sys:ro \\ --volume=/var/lib/docker/:/var/lib/docker:ro \\ --volume=/dev/

stackoverflow.com

위의 스택 오버플로우에서 비슷한 사람을 만났고, 이 사람의 말로는 cgroup버젼 호환성이라고 말을 해주었다.

설마 Readme.md에 있는게 최신이 아니겠어... 라는 생각에 직접 릴리즈에 들어가보았다.

<https://github.com/google/cadvisor/releases>

Releases · google/cadvisor

Analyzes resource usage and performance characteristics of running containers. - google/cadvisor

github.com

망할... 0.47.0이 최신 버젼이라는 것을 알게 되었다. (**갱신 좀해**)

그래서 버젼을 바꾸어 실행을 해보니

![](/assets/img/posts/cadvisor-failed-to-get-containers-2.png)

이제야 잘 나온다...

다른 분 들은 나처럼 삽질을 안하길 빈다...
