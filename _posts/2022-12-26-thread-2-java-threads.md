---
title: "스레드(2) - 스레드 with Java"
date: 2022-12-26 23:42:54 +0900
categories: ["CS", "잡 지식"]
tags: ["잡 지식"]
description: "실행중인 프로그램 - 자신의 주소 공간에서 순차적으로 실행되는 스트림"
last_modified_at: 2023-02-18 20:08:37 +0900
tistory_id: 10
---
본격적으로 스레드에 대해 배워보자

## 프로세스

- **실행중인 프로그램**
- **자신의 주소 공간에서 순차적으로 실행되는 스트림**

이렇게 정의 내릴 수가 있다.

## 스레드

- **프로그램 내의 단일 순차적 제어 흐름**
- OS 측면에선 각 스레드들은 밑에 내용들로 구성되어 있다.
  - PC (program counter)
  - Register Set
  - Stack
- 스레드들이 서로 공유하는 것이 있는데
  - 코드 영역
  - 데이터 영역
  - OS resources ex) open files

### 싱글 스레드 프로세스

![image](/assets/img/posts/thread-2-java-threads-1.png)

자 보면 스레드 하나가 있고, 위에서 설명한 대로 register, stack, pc(는 안보인다 지금은), code, data, files가 있는 것을 확인 가능하다.

### 멀티 스레드 프로세스

![image](/assets/img/posts/thread-2-java-threads-2.png)

확실히 차이가 나는 것을 확인이 가능하다.

각 스레드마다 regiset, stack은 고유하게 가지나, code, data, files는 서로 공유하고 있다.

(만약 동기화의 얘기가 나온다면 당연하게도 저 위 3개의 영역이 제일 영향을 받는 것이다.)

여기서 stack은 간단하게 말하자면 local 변수들을 담아두는 곻간이라 생각하면 쉽다.

그래서 각 스레드가 가진 지역변수는 다른 스레드가 볼 수 없다.

### 멀티 프로세스 vs 멀티 스레드

- Process
  - Process는 process 0을 제외하고서 모든 프로세스는 fork()라는 명령어를 통해 만들어 진다.
  - 그래서 child process는 parent process를 그대로 copy해가지고 온다
  - 그렇기에 자식과 부모가 동일한 코드를 실행한다
  - 당연히 자식 프로세스는 부모의 변수들을 copy한다
  - 그렇기에 시작이 매우 비싸다고 할 수 있다.
  - 그러나 변수에 대한 동시 접근에 대한 걱정은 없어지게 된다 (다 복사해오니)
- Thread
  - 자식이 부모의 변수를 공유해서 사용한다
  - 그렇기에 아주 가볍게 시작한다
  - 동시 접근에 대한 issue가 있다

![image](/assets/img/posts/thread-2-java-threads-3.png)

그림으로 보면 이해가 더 쉽다

위의 프로세스를 봐라

딱 봐도 무거워 보이지 않는가. 이걸 fork할시 계속 복사 한다 생각하면 thread가 얼마나 가벼운지 알게 될 수 있다.

## Thread with Java

자바로 스레드를 배워보자(입문)

스레드에 관한 내용을 배우면서 자바는 어떻게 짜는지에 대해 공부하는 것이다.

그렇기에 자바로 스레드를 활용 하는 것은 따로 공부하는 것이 좋을 듯 하다.

#### 방법 1. Thread를 상속받자

```scala
class MyThread extends Thread{
    public void run(){
        //작업 할 것
    }
}

....
MyThread t = new MyThread();
t.start();
```

#### 방법 2. Runnable 인터페이스를 구현하자

```python
class MyRunnable implements Runnable{
    public void run() {
        System.out.println(“MyRunnable.run()”);
    }
//other methods and data for this class
}
MyRunnable myrun= new MyRunnable();
Thread t = new Thread(myrun);
t.start()
```

#### 스레드 Life-Cycle

![image](/assets/img/posts/thread-2-java-threads-4.png)

스레드는 만들어지고 start를 안한다면 실행을 안한다.

그래서 start를 하면 Alive 상태가 되고, run이 끝나거나 stop이 나오면 종료가 된다.

![image](/assets/img/posts/thread-2-java-threads-5.png)

또한 Alive 상태가 된다면 안에서 또 substate가 존재한다.

Running, Runnable, non-runnable 상태가 있다.

실행 중일때 yield 명령어를 사용한다면 runnable상태가 되고,

wait, sleep, block이 되면 non-runnable이 된다.

물론 이 상태에서도 notify, 시간 만료, I/O가 된다면 Running으로 바로가는게 아닌 Runnable로 가게 된다.

#### 스레드 우선순위

스레드에도 우선순위를 둘 수 있다.

1~10사이의 숫자로 우선순위를 설정 가능하다.

선점적인 스케쥴링이 가능하게 해준다

JVM은 우선순위가 높은 스레드를 선호한다고 하기 때문이다. (보장되지는 않긴 하다.)

#### yield

- 스케쥴러가 다른 실행 가능한 스레드를 고르게 허락해준다
- 물론 어떤게 선택 될지는 모른다

#### Thread sleep, suspend, resume

- static void sleep
  - 즉 block시킨다는 말이다.
- stop(), suspend() ,resume() 은 deprecated가 되었다

#### Thread Waiting & Status Check

- **void join()**
  - A라는 스레드가 B가 끝날때까지 기달린다는 의미이다.

### Thread Synchronization

스레드는 동시에 여러 일을 작업하게 된다.

그렇기에 문제가 발생 할 수 있다.

Safety와 Liveness에 대해 문제가 생길 수 있다.

- Safety
  - 아무런 나쁜 일이 안생기는 것이다.
  - no race condition
- Liveness
  - deadlock같은게 없는 상태

#### race condition 예시

```cpp
class Account{
    private int balance;
    public void deposit(int val){
        balance = balance + val;
    }
    public void withdraw(int val){
        balance = balance - val;
    }
}
```

위의 상황을 봐라.

만약 스레드들이 deposit과 withdraw를 막 실행 한다 생각해보자, 돈이 입금되고 출금이 되야하는 상황에서 출금되고 입금되는 순서가 역전되는 상황이 안 벌어 질 것이라고 장담 가능한가?

불가능하다.

#### synchronized keyword

자바에서 동기화를 하는 방법 중 하나로 **synchronized keyword**를 붙일 수 있다.

ex)

```java
class Account{
    private int balance;
    public synchronized void deposit(int val){
        balance = balance + val;
    }
    public synchronized void withdraw(int val){
        balance = balance - val;
    }
}
```

#### Synchronized Lock Object

Lock을 Object 단위로도 걸 수 있다.

ex)

```scala
class TransThread extends Thread
{
    private FinTrans ft;
    TransThread (FinTrans ft, String name)
    {
        super (name); // Save thread's name
        this.ft = ft; // Save reference to financial transaction object
    }
    public void run ()
    {
        for (int i = 0; i < 100; i++){
        if (getName ().equals ("Deposit Thread"))
        {
            synchronized (ft){
            ft.transName = "Deposit";
            try{
                Thread.sleep ((int) (Math.random () * 1000));
        }
        catch (InterruptedException e) {}
        ft.amount = 2000.0;
        System.out.println (ft.transName + " " + ft.amount);
    }
}
```

위 예시는 ft를 보호하고 있는 것을 확인 할 수 있다.

### Condition Variables

- lock(synchronized)
  - 스레드가 데이터 접근하는 것을 control
- condition variable (wait, notify/notifyall)
  - 스레드들이 특정 상황이 올 때 까지 기달리게 하는 것
  - 즉 스레드들이 자동으로 lock에서 해제되고 sleeping state에 들어가게 해준다
  - 만약 이게 없다면 프로그래머들이 직접 일일히 다 해제하고, 조건을 확인하고 해야할텐데… 참 끔찍한 일이었을 것 같다
  - condition variable은 항상 mutex lock과 같이 사용된다

#### wait & notify

- wait
  - interrupt가 없다면, 현재 스레드는 blocked된다
  - 그럼 그 스레드는 wait set에 배치가 된다.
  - Object의 Synchronization lock 해제된다
- notify
  - 스레드 하나가, T한테 wait set에서 제거하라고 말한다.
  - 그럼 T는 이제 락에서 해제되고, waiting status에서 재개한다.

ex)

```java
class ParkingGarage {
    private int places;
    public ParkingGarage(int places) {
        if (places < 0)
            places = 0;
        this.places = places;
    }
    public synchronized void enter() { // enter parking garage
        while (places == 0) {
            try {
                wait();
            } catch (InterruptedException e) {}
        }
        places--;
    }
    public synchronized void leave() { // leave parking garage
        places++;
        notify();
    }
}
```

```python
class Car extends Thread {
    private ParkingGarage parkingGarage;
    public Car(String name, ParkingGarage p) {
        super(name);
        this.parkingGarage = p;
        start();
    }
    public void run() {
        while (true) {
            try {
                sleep((int)(Math.random() * 10000)); // drive before parking
            } catch (InterruptedException e) {}
        parkingGarage.enter();
        System.out.println(getName()+": entered");
        try {
            sleep((int)(Math.random() * 20000)); // stay within the parking garage
        } catch (InterruptedException e) {}
        parkingGarage.leave();
        System.out.println(getName()+": left");
        }
    }
}
```

간단한 차고지 예시이다.

만약 주차장에 차가 들어오게 된다고 가정해보자.

차가 들어오고, 그럼 그 스레드를 wait시킨다.

자 그러다가 차가 빠져나가게 되면 notify를 함으로서 다른 스레드들에게 말한다. 야 나 나가니깐 아무나 들어와.

그럼 이제 락에서 어떤 한 스레드가 해제되어 들어오게 되는 것이다.
