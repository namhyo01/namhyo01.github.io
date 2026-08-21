---
title: 'SELECT - 3월에 태어난 여성 회원 목록 출력하기'
description: '드디어 MYSQL의 함수들을 이용하는 시간이 왔다.'
pubDate: 2023-02-22
category: 'DB/MySQL'
tistoryId: 33
---
드디어 MYSQL의 함수들을 이용하는 시간이 왔다.

처음 써보는 날짜 관련 함수인지라 많은 애로사항이 있었으나 잘 극복한것 같다.

### 참고 사이트

<https://jang8584.tistory.com/7>

[mysql]날짜 관련 함수 모음

[mysql-함수]날짜 관련 함수 모음 dayofweek(date) 날짜를 한 주의 몇 번째 요일인지를 나타내는 숫자로 리턴한다. (1 = 일요일, 2 = 월요일, ... 7 = 토요일) mysql> select dayofweek('1998-02-03'); -> 3 weekday(date) 날

jang8584.tistory.com

정말 도움이 많이된 사이트이다. 여기서 나온 것들을 가져와 보았다.

**dayofweek(date)**

날짜를 한 주의 몇 번째 요일인지를 나타내는 숫자로 리턴한다.

(1 = 일요일, 2 = 월요일, ... 7 = 토요일)

mysql> select dayofweek('1998-02-03');

-> 3

**weekday(date)**

날짜를 한 주의 몇 번째 요일인지를 나타내는 숫자로 리턴한다. (0 = 월요일, 1=화요일 ... 6 = 일요일)

mysql> select weekday('1997-10-04 22:23:00');

-> 5

mysql> select weekday('1997-11-05');

-> 2

---

특히 이 3개는 외워두는 것이 좋을 것 같다.

**dayofmonth(date)**

그 달의 몇 번째 날인지를 알려준다. 리턴 값은 1에서 31 사이이다.

mysql> select dayofmonth('1998-02-03');

-> 3

**dayofyear(date)**

한 해의 몇 번째 날인지를 알려준다. 리턴 값은 1에서 366 사이이다.

mysql> select dayofyear('1998-02-03');

-> 34

**month(date)**

해당 날짜가 몇 월인지 알려준다. 리턴 값은 1에서 12 사이이다.

mysql> select month('1998-02-03');

-> 2

---

**dayname(date)**

해당 날짜의 영어식 요일이름을 리턴한다.

mysql> select dayname("1998-02-05");

-> thursday

**monthname(date)**

해당 날짜의 영어식 월 이름을 리턴한다.

mysql> select monthname("1998-02-05");

-> february

**quarter(date)**

분기를 리턴한다 (1~ 4)

mysql> select quarter('98-04-01');

-> 2

**week(date)**

**week(date,first)**

인수가 하나일 때는 해달 날짜가 몇 번째 주일인지(0 ~ 52)를 리턴하고 2개일 때는 주어진 인수로 한 주의 시작일을 정해 줄 수 있다. 0이면 일요일을1이면 월요일을 한 주의 시작일로 계산해 몇 번째 주인가 알려준다.

mysql> select week('1998-02-20');

-> 7

mysql> select week('1998-02-20',0);

-> 7

mysql> select week('1998-02-20',1);

-> 8

**year(date)**

년도를 리턴한다.(1000 ~ 9999)

mysql> select year('98-02-03');

-> 1998

**hour(time)**

시간을 알려준다.(0 ~ 23)

mysql> select hour('10:05:03');

-> 10

**minute(time)**

분을 알려준다(0 ~ 59)

mysql> select minute('98-02-03 10:05:03');

-> 5

**second(time)**

초를 알려준다(0 ~ 59)

mysql> select second('10:05:03');

-> 3

**period\_add(p,n)**

yymm 또는 yyyymm 형식으로 주어진 달에 n개월을 더한다. 리턴 값은 yyyymm의 형식이다.

mysql> select period\_add(9801,2);

-> 199803

**period\_diff(p1,p2)**

yymm 또는 yyyymm 형식으로 주어진 두 기간사이의 개월을 구한다

mysql> select period\_diff(9802,199703);

-> 11

**date\_add(date,interval expr type)**

**date\_sub(date,interval expr type)**

**adddate(date,interval expr type)**

**subdate(date,interval expr type)**

위의 함수들은 날자 연산을 한다. 잘 만 사용하면 꽤나 편리한 함수 들이다. 모두 mysql 3.22 버전에서 새롭게 추가되었다. adddate() 과 subdate() 는 date\_add() 와 date\_sub()의 또 다른 이름이다.

인수로 사용되는 date 는 시작일을 나타내는 datetime 또는date 타입이다. expr 는 시작일에 가감하는 일수 또는 시간을 나타내는 표현식이다.

**type** 값의 의미\
사용 예

**second, seconds**\
초\
**minute, minutes**\
분

**hour, hours**\
시간\
**day, days**\
일\
**month, months**\
월\
**year, years**\
년

**minute\_second, "minutes:seconds"**\
분:초\
**hour\_minute, "hours:minutes"**\
시:분\
**day\_hour, "days hours"**\
일 시\
**year\_month, "years-months"**\
년 월\
**hour\_second, "hours:minutes:seconds"**\
시 분\
**day\_minute, "days hours:minutes"**\
일, 시, 분\
**day\_second, "days hours:minutes:seconds"**\
일, 시, 분, 초

---

**to\_days(date)**

주어진 날짜를 0000년부터의 일수로 바꾼다.

mysql> select to\_days(950501);

-> 728779

mysql> select to\_days('1997-10-07');

-> 729669

**from\_days(n)**

주어진 일수 n로부터 날짜를 구한다

mysql> select from\_days(729669);

-> '1997-10-07'

---

**%M**\
월이름 (january..december)

**%w**\
요일명 (sunday..saturday)

**%D**\
영어식 접미사를 붙인 일(1st, 2nd, 3rd, etc.)

**%Y**\
4자리 년도

**%y**\
2자리 년도

**%a**\
짧은 요일명(sun..sat)

**%d**\
일(00..31)

**%e**\
일(0..31)

**%m**\
월(01..12)

**%c**\
월(1..12)

**%b**\
짧은 월이름 (jan..dec)

**%j**\
한해의 몇 번째 요일인가 (001..366)

**%H**\
24시 형식의 시간 (00..23)

**%k**\
24시 형식의 시간 (0..23)

**%h**\
12시 형식의 시간 (01..12)

**%i**\
12시 형식의 시간 (01..12)

**%l**\
시간 (1..12)

**%i**\
분 (00..59)

**%r**\
시분초12시 형식 (hh:mm:ss [ap]m)

**%t**\
시분초 24시 형식 (hh:mm:ss)

**%s**\
초 (00..59)

**%s**\
초 (00..59)

**%p**\
am 또는 pm 문자

**%w**\
일주일의 몇 번째 요일인가(0=sunday..6=saturday)

**%U**\
한해의 몇 번째 주인가(0..52). 일요일이 시작일

**%u**\
한해의 몇 번째 주인가(0..52). 월요일이 시작일

**%%**\
\`%' 문자를 나타냄

이러한 DATE\_FORMAT함수들은 무조건 알아두자

---

**curdate()**

**current\_date()**\
오늘 날짜를 'yyyy-mm-dd' 또는 yyyymmdd 형식으로 리턴한다, 리턴 값은 이 함수가 문자열로 쓰이느냐 숫자로 쓰이느냐에 따라 달라진다.

mysql> select curdate();

-> '1997-12-15'

mysql> select curdate() + 0;

-> 19971215

**curtime()**

**current\_time()**

'hh:mm:ss' 또는 hhmmss 형식으로 현재시간을 나타낸다. 리턴 값은 이 함수가 문자열로 쓰이느냐 숫자로 쓰이느냐에 따라 달라진다.

mysql> select curtime();

-> '23:50:26'

mysql> select curtime() + 0;

-> 235026

**now()**

**sysdate()**

**current\_timestamp()**

오늘 날자와 현재 시간을 'yyyy-mm-dd hh:mm:ss' 또는 yyyymmddhhmmss 형식으로 리턴 한다, 역시 리턴 값은 이 함수가 문자열로 쓰이느냐 숫자로 쓰이느냐에 따라 달라진다. 실제 개발 시 사용자의 등록일시 등을 나타낼 때 유용하게 쓰이는 함수다. 뒷부분의 실전예제에서 보게 될 것이다.

mysql> select now();

-> '1997-12-15 23:50:26'

mysql> select now() + 0;

-> 19971215235026

**sec\_to\_time(seconds)**

주어진 초를 'hh:mm:ss' 또는 hhmmss 형식의 시간단위로 바꿔준다.

mysql> select sec\_to\_time(2378);

-> '00:39:38'

mysql> select sec\_to\_time(2378) + 0;

-> 3938

**time\_to\_sec(time)**

주어진 시간을 초 단위로 바꿔준다.

mysql> select time\_to\_sec('22:23:00');

-> 80580

mysql> select time\_to\_sec('00:39:38');

-> 2378

---

## 정리

**DAYOFMONTH(date)** : 날짜만 리턴해주는 함수. (1-31) 한달을 단위로.\
**DAYOFYEAR(date)** : 이역시 날짜만 리턴. (1-366) 1년을 단위로.\
**TO\_DAYS(date)** : 연도와 달을 모두 날짜화 시켜서 리턴해줍니다.\
 (1999-01-01 = (1999 \* 365) + (01 \* 31) + 1)\
**MONTH(date)** : 달을 리턴해주는 함수.\
**DAYNAME(date)** : 요일을 문자로 리턴. (ex :'Thursday')\
**MONTHNAME(date)** : 달을 문자로 리턴. (ex :'February')\
**WEEK(date)** : 해당 연도에 몇번째 주인지를 리턴 (0-52)\
**YEAR(date)** : 연도를 리턴 (1000-9999)\
**HOUR(time)** : 시간 리턴\
**MINUTE(time)** : 분 리턴\
**SECOND(time)** : 초 리턴

**DATE\_FORMAT(date,format)**

\`%W' Weekday name (\`Sunday'..\`Saturday')\
 \`%D' Day of the month with english suffix (\`1st', \`2nd', \`3rd',\
 etc.)\
 \`%Y' Year, numeric, 4 digits\
 \`%y' Year, numeric, 2 digits\
 \`%a' Abbreviated weekday name (\`Sun'..\`Sat')\
 \`%d' Day of the month, numeric (\`00'..\`31')\
 \`%e' Day of the month, numeric (\`0'..\`31')\
 \`%m' Month, numeric (\`01'..\`12')\
 \`%c' Month, numeric (\`1'..\`12')\
 \`%b' Abbreviated month name (\`Jan'..\`Dec')\
 \`%j' Day of year (\`001'..\`366')\
 \`%H' Hour (\`00'..\`23')\
 \`%k' Hour (\`0'..\`23')\
 \`%h' Hour (\`01'..\`12')\
 \`%I' Hour (\`01'..\`12')\
 \`%l' Hour (\`1'..\`12')\
 \`%i' Minutes, numeric (\`00'..\`59')\
 \`%r' Time, 12-hour (\`hh:mm:ss [AP]M')\
 \`%T' Time, 24-hour (\`hh:mm:ss')\
 \`%S' Seconds (\`00'..\`59')\
 \`%s' Seconds (\`00'..\`59')\
 \`%p' \`AM' or \`PM'\
 \`%w' Day of the week (\`0'=Sunday..\`6'=Saturday)\
 \`%U' Week (\`0'..\`52'), Sunday is the first day of the week.\
 \`%u' Week (\`0'..\`52'), Monday is the first day of the week.\
 \`%%' Single \`%' characters are ignored. Use \`%%' to produce a\
 literal \`%' (for future extensions).

### 코드

```sql
SELECT MEMBER_ID, MEMBER_NAME, GENDER, date_format(date_of_birth, '%Y-%m-%d') as 'DATE_OF_BIRTH'
FROM MEMBER_PROFILE
WHERE month(DATE_OF_BIRTH)=3 AND TLNO IS NOT NULL AND GENDER = 'W'
ORDER BY MEMBER_ID
```
