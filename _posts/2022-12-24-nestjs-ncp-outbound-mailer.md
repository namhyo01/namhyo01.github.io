---
title: "[NestJS] 네이버 클라우드 플랫폼 Out bound Mailer with Module"
date: 2022-12-24 03:04:35 +0900
categories: ["Backend", "nest.js"]
tags: ["nest.js"]
description: "작성일시: 2022년 12월 23일 오후 8:13 최종 편집일시: 2022년 12월 24일 오전 3:01"
tistory_id: 5
---
## [NestJS] - 메일 보내기 기능 개발

작성일시: 2022년 12월 23일 오후 8:13  
최종 편집일시: 2022년 12월 24일 오전 3:01

![image](/assets/img/posts/nestjs-ncp-outbound-mailer-1.png)

저희 팀이 회원가입관련 기능을 만들어야 하는 중, 메일을 보내 인증을 하는 절차가 있었다.

이 전까지는 새로운 네이버 아이디를 하나 만든 후, `nodemailer`를 이용하여 메일을 보냈는데, 이 경우 관리하기가 조금 귀찮다는 문제가 있었다.

그래서 NCP를 사용하는 프로젝트이므로, NCP에서 지원하는 Out bound Mailer를 이용해서 개발해 보자.

당연하게도 `nodemailer`같은 쉽고 간단한 패키지는 존재하지 않는다…

그래서 내가 직접 만들어 보기로 결정했다. 그냥 Service단에다가 다 넣는 방식도 있겠지만, 이것을 동적 모듈로 만든다면 재활용하기도 편할 뿐 아니라, npm에 등록도 해볼 수 있지 않을까 해서 선택하였다.

자 이제 Naver Cloud Platform의 Out bound Mailer를 이용하여 메일을 보내는 기능을 만들어 보자.

## Dynamic Module?

### Module?

NestJS에서 `Module`은 애플리케이션의 구조를 구성하는데 사용된다.

기본적으로 `Singleton Pattern`으로 구성되며, Provider내에서 모듈들을 쉽게 공유해 사용이 가능하다.

이들은 `@Module`이라는 데코레이터로 작성되어 있어 구분하기가 쉽다.

NestJS에서 모듈은

- 정적 모듈
- 동적 모듈

이렇게 두가지로 분류가 된다.

#### 정적 모듈

NestJS가 필요한 모든 정보들을 미리 호스트 및 consuming 모듈에서 선언해 사용한다. 우리가 보통 NestJS를 사용해 만든 모듈들은 정적 모듈에 해당된다.

ex)

```css
@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

#### 동적 모듈

정적 모듈과 반대로 모듈 등록과 Provider를 동적으로 설정이 가능해, custom 가능하게 만들어 준다.

대표적인 예시가 ConfigModule이 있다.

```css
ConfigModule.forRoot({
      envFilePath: [join(__dirname, '..', `.env.${process.env.NODE_ENV}`)],
      isGlobal: true, //전역 사용
}),
```

### 설정

1. NCP 로그인
2. Cloud Outbound Mailer 이용 신청
3. 마이페이지 - 인증키 관리로 API 인증키 발급
4. 그러면 Access Key ID, Secret Key를 두개 다 얻으실 수 있으실 겁니다.

만약 자세한 정보를 원하신다면 검색하시는 것을 추천드립니다.

### 코드

#### 사전 작업

1. Module 생성

```
    nest g module mail
```

이렇게 일단 mail이라는 모듈을 생성한다.

1. 패키지 설치

- NCP의 Outband Mailer는 RestFul 형태로 API가 제공되기에, `axios`같은 패키지가 필요하다

```dockerfile
yarn add axios
```

1. 환경변수 작성

- 여기서 저는 Configure에 환경변수를 등록해 사용하는 방식을 선호하기에, 사용을 했는데, 이거는 개인 취향이 조금 탈 거 같다

```
# .env
```

```
# NAVER CLOUD PLATFORM
  ACCESS_KEY_ID=퍼블릭키
  SECRET_KEY=비밀키
  SENDER_ADDRESS=상대방에게 보일 메시지 주소
  NCLOUD_MAIL_API_DOMAIN=https://mail.apigw.ntruss.com/
```

1. Dynamic Module 생성

본격적으로 만들어보자

- 첫번째로 Mail Module을 Dynamic하게 해줄, Module Option을 정의하자

```dart
// src/common/mail.constants.ts

  export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
```

위 변수는 모듈 설정 옵션을 정의하기 위한 DI 토큰으로 정의

```yaml
// src/mail/mail.interface.ts

  export interface MailModuleOptions {
    apiKey: string; // 네이버 클라우드 플랫폼 포털에서 발급받은 Access Key ID 값
    secret: string; // Access Key ID 값 과 Secret Key 로 암호화한 서명
    senderAddress: string; // 발송자 Email 주소. 임의의 도메인 주소 사용하셔도 됩니다만, 가능하면 발신자 소유의 도메인 Email 계정을 사용하실 것을 권고드립니다.
    language: string; // API 응답 값의 다국어 처리를 위한 값. (입력 값 예시: ko-KR, en-US, zh-CN, 기본 값:en-US)
  }
```

이 부분에 대해서는 변경의 필요가 없기는 하지만 만약 본인 도메인에서는 뭔가 추가해야되거나 업데이트가 일어났다면 수정을 하면 된다

- Mail Module

```javascript
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    //forRoot정의해주자 => 동적 모듈이니
    return {
      module: MailModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
      exports: [],
    };
  }
}
```

정적 모듈과 비교를 하면 `forRoot`이라는 `static 메소드가` 추가된 것을 확인 가능하다

자 이제 `options`를 `useValue`로 지정하고, 이 options를 `DI`(dependency inject)하기 위해 `CONFIG_OPTIONS`를 토큰 값으로 주는 형태로 모듈을 정의 했다.

1. 그 다음 사용할 or AppModule에다가 imports를 하자

```yaml
MailModule.forRoot({
      apiKey: process.env.ACCESS_KEY_ID,
      secret: process.env.SECRET_KEY,
      senderAddress: process.env.SENDER_ADDRESS,
      language: 'ko-KR', // 한국어
    }),
```

1. Service 만들자

- 이제 실제 기능을 할 서비스를 만들자

```
nest g service mail
```

그다음 DTO를 만들어 주는데

```typescript
// src/mail/dto/send-email.dto.ts

  import { Type } from 'class-transformer';
  import { IsOptional, IsString, ValidateNested } from 'class-validator';
  import { CommonResponseDto } from 'src/common/dto/common.dto';

  export class Recipients {
    @IsString()
    address: string; // 수신자 주소
    @IsString()
        @IsOptional()
    name: string; // 수신자 이름(생략가능)
    @IsString()
    type: string; // 보통 읽기전용인 'R'을 선호한다. 자세한건 NCP 메일 바운드에서 확인하자
  }

  export class SendEmailRequestDto {
    @IsString()
    senderName: string; //송신자 주소
    @IsString()
    title: string; // 이메일 제목
    @IsString()
    body: string; // 이메일 내용
    @ValidateNested({ each: true })
    @Type(() => Recipients)
    recipients: Recipients[];
  }
    /**
        이 부분은 굳이 만들 필요없이 필요한 부분만 사용하셔도 될것 같습니다.
    */
  export class SendEmailResponseDto extends CommonResponseDto {
    @IsOptional()
    @IsString()
    requestId?: string;
    @IsOptional()
    @IsString()
    count?: number;
  }
```

```kotlin
// src/common/dto/common.dto.ts
  import { IsBoolean, IsOptional, IsString } from 'class-validator';

  export class CommonResponseDto {
    @IsBoolean()
    status: boolean;
    @IsOptional()
    @IsString()
    error?: string;
    @IsOptional()
    @IsString()
    message?: string;
  }
```

```typescript
@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(reqData: SendEmailRequestDto) {
    const url = `/api/v1/mails`;
    const method = `POST`;
    try {
      await axios.post<{ requestId: string; count: number }>(
        `${this.configService.get('NCLOUD_MAIL_API_DOMAIN')}${url}`,
        {
          senderAddress: this.options.senderAddress,
          ...reqData,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-ncp-apigw-timestamp': new Date().getTime().toString(10),
            'x-ncp-iam-access-key': this.options.apiKey,
            'x-ncp-apigw-signature-v2': this.makeSignature(
              method,
              url,
              new Date().getTime().toString(),
              this.options.apiKey,
              this.options.secret,
            ),
            'x-ncp-lang': this.options.language,
          },
        },
      );
    } catch (error) {
      throw new CommonMailerFail();
    }
  }

  private makeSignature(
    method: string,
    url: string,
    timestamp: string,
    accessKey: string,
    secretKey: string,
  ): string {
    const space = ' '; // 공백
    const newLine = '\n'; // 줄바꿈

    const hmac = createHmac('sha256', secretKey);

    hmac.write(method);
    hmac.write(space);
    hmac.write(url);
    hmac.write(newLine);
    hmac.write(timestamp);
    hmac.write(newLine);
    hmac.write(accessKey);

    hmac.end();

    return Buffer.from(hmac.read()).toString('base64');
  }
}
```

이제 NCP의 요구사항 대로 맞춰 요청하자.

이 부분은 밑 사이트에서 자세하게 설명해주고 있다.

[NestJS 메일 발송 Dynamic Module](https://velog.io/@1yongs_/NestJS-%EB%A9%94%EC%9D%BC-%EB%B0%9C%EC%86%A1-Dynamic-Module)

1. 테스트

이제 직접 테스트를 해보자

![제목 없음](/assets/img/posts/nestjs-ncp-outbound-mailer-2.png)

이렇게 잘 오는 것을 확인 할 수 있다.

### 더 발전해보기

윗 부분 까지는 참고한 블로그랑 큰 차이점이 없다.

하지만 이렇게 할경우 내 환경에선 문제가 하나 있다.

바로 NestJS에서는 `process.env`보다는 `ConfigModule`로 환경변수를 관리한다.

하지만 `forRoot`를 사용시 `ConfigModule`을 활용하여 환경변수를 가져오는 것이 불가능하다.

그래서 보통 우리는 `forRootAsync`를 이용하여 `ConfigModule`을 비동기로 imports해서 사용을 한다.

그럼 `forRootAsync`를 사용할 수 있게 코드를 수정해보자

**1. AsyncOptions생성**

```javascript
// mail.interface.ts
export interface MailOptionsFactory {
  createMailOptions(): Promise<MailModuleOptions> | MailModuleOptions;
}

export interface MailModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<MailOptionsFactory>;
  useClass?: Type<MailOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<MailModuleOptions> | MailModuleOptions;
  inject?: any[];
  isGlobal?: boolean;
}
```

`Async`를 위한 옵션을 생성한다.

`Option`을 만들기 위해 `Pick<ModuleMetadata, ‘imports’>`를 상속받아 사용한다

`useExisting`같은 경우 별명을 만든다 생각하면 쉽다.(개인적으로 사용해 본 적은 없다.)

`useClass`는 클래스를 동적으로 결정 가능하다.

`useFactory`는 provider를 동적으로 만들 수 있다. 실제 `provider`는 `factory`함수에서 반환되는 값으러 결정된다.

자세한 내용은 [공식문서를](https://docs.nestjs.com/fundamentals/custom-providers) 참고하면 좋다

여기서 특별한점은 `isGlobal`인데, 나는 `AppModule`에서 이 모듈을 등록후 전역으로 사용하고 싶기에, 이 옵션을 추가하였다.

**2. forRootAsync 메소드 생성**

```gradle
// mail.module.ts
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/constants/mail.constants';
import {
  MailModuleOptions,
  MailModuleAsyncOptions,
  MailOptionsFactory,
} from './mail.interface';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    //forRoot정의해주자 => 동적 모듈이니
    return {
      module: MailModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
      global: options.isGlobal,
      exports: [],
    };
  }
  static forRootAsync(options: MailModuleAsyncOptions): DynamicModule {
    return {
      module: MailModule,
      global: options.isGlobal,
      imports: options.imports || [],
      providers: this.createAsyncProviders(options),
    };
  }

  private static createAsyncProviders(
    options: MailModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }
  private static createAsyncOptionsProvider(
    options: MailModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: CONFIG_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: CONFIG_OPTIONS,
      useFactory: async (optionsFactory: MailOptionsFactory) =>
        await optionsFactory.createMailOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
```

- 위 코드가 `forRoot`만 있었다면 이젠 `forRootAsync`가 추가된 것을 확인할 수 있다.
- 차이점이라고 하면 일단 `imports`랑 `providers`에서 차이가 나온다.
- 왜냐하면 `useValue`로 값을 받는 것이 아니기에, `imports`에서 `options.imports`를 받아온다.
- `createAsyncProviders`메소드를 보면 일단 `useClass`나 `useFactory`가 선언되었다면 `createAsyncOptionsProvider`메소드를 호출하게 하고, 그 외 아무것도 호출되지 않았거나 `useExisting`이라면 `createAsyncOptionsProvider`의 결과값과를 return하게 한다.
- `{
  provide: options.useClass,
  useClass: options.useClass,
  },`
- `createAsyncOptionsProvider`의 경우
  - `useFactory`일 경우 `provide`에는 토큰을, `inject`에는 옵션의 `inject`를 그 다음에 `useFactory`에는 옵션의 `useFacotry`를 그대로 넣어서 반환한다.
  - 그 외에는 `provide`에는 토큰이 동일하고, `inject`에는 `useExisting` or `useClass` 둘 중 있는 값을 주입하고, `useFactory`에는 위 `interface`에서 선언한 `createMailOptions()` 메소드를 선언한다.
  - 그리고 그것을 반환한다

이 과정을 통해 `forRootAsync`가 작동이 된다.

#### 궁금한 점

> 다만 `createJwtOptions()` 이 메소드는 현재 `interface`상 아무 내용도 들어가 있지 않다.  
> 당연하게 아무 내용이 안들어가 있는 것이다.  
> 따라서 만약에 사용해야 한다면 어떻게 해야하는가?

이것은 `useClass`를 실제로 사용한 예시로 비교하면 좋다

- `useClass`를 사용한다면

```css
MailModule.registerAsync({
  useClass: MailConfigService
});
```

그럼 이 `MailConfigService`의 내용을 보면

```python
class MailConfigService implements MailOptionsFactory {
  createMailOptions(): MailModuleOptions{
    return {
      // 내용물들!!
    };
  }
}
```

이런식으로 실행하면 된다.

- `useExsiting`은?

```css
MailModule.registerAsync({
  imports: [ConfigModule],
  useExisting: ConfigService,
}),
```

대충 이런느낌이라고 가정한다면 `useClass`와 큰 차이점은 없지만 하나가 다르다.

자체적으로 인스턴스화를 하는 것이 아닌 `ConfigService`가 이미 만들어져 있다면 재활용해서 `import`를 한다는 차이가 있다.

### 느낀점

현재까지 단순하게 외부 패키지를 install하거나 내장 모듈을 사용하는 형태로만 사용을 했었는데, 내가 직접 dynamic module을 만듬으로서 NestJS에 한단계 더 이해도를 높였다.

직접 코드를 뜯어보면서 해서 어색하고, 어려운 점도 많았지만 생각보다 극복을 잘해서 뿌듯함도 있다.

첫글인데, 너무 중구난방 글을 작성해서 조금 아쉽기는 하지만 뿌듯함은 있는 것 같다.

### 참고 사이트

[NestJS 메일 발송 Dynamic Module](https://velog.io/@1yongs_/NestJS-%EB%A9%94%EC%9D%BC-%EB%B0%9C%EC%86%A1-Dynamic-Module)

[jwt/jwt.module.ts at master · nestjs/jwt](https://github.com/nestjs/jwt/blob/master/lib/jwt.module.ts)

[Creating Dynamic Modules in Nest JS Part-2](https://dev.to/tkssharma/creating-dynamic-modules-in-nest-js-part-2-g1j)

[NestJS dynamic module 직접 만들어보기](https://the-masked-developer.github.io/wiki/%5Bnestjs%5Ddynamic-module/)
