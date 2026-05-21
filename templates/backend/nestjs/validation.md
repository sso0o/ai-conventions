# NestJS Validation

## ValidationPipe 전역 설정

`main.ts`에서 한 번만 설정한다. 컨트롤러 또는 핸들러 단위 `@UsePipes()` 사용을 금지한다 — 일부 핸들러에만 파이프가 적용되면 검증 누락이 발생한다.

```ts
// ✅
// main.ts
app.useGlobalPipes(new ValidationPipe({ ... }));

// ❌
// user.controller.ts
@UsePipes(new ValidationPipe())
@Controller('users')
export class UserController {}
```

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

- `whitelist: true` — DTO에 없는 필드는 자동으로 제거한다
- `forbidNonWhitelisted: true` — DTO에 없는 필드가 포함된 요청은 400으로 거부한다
- `transform: true` — 문자열 쿼리 파라미터를 DTO에 선언된 타입으로 자동 변환한다

> `forbidNonWhitelisted`는 `whitelist: true`가 설정된 경우에만 동작한다.

## DTO 작성 규칙

- 모든 요청 바디와 쿼리 파라미터는 `class`로 정의한다
- 선택적 필드는 반드시 `@IsOptional()`을 명시한다
- 쿼리 파라미터의 숫자 타입은 `@Type(() => Number)`를 함께 선언한다
- 중첩 객체는 `@ValidateNested()` + `@Type()`을 반드시 함께 사용한다

### 기본 DTO

```ts
// ✅
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })
  email: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  age?: number;
}
```

### 쿼리 파라미터 DTO

```ts
// ✅
export class GetUsersQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  size?: number = 20;
}
```

### 중첩 객체

```ts
// ✅
export class CreateOrderDto {
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}

// ❌ — @Type() 누락 시 내부 필드 검증이 동작하지 않는다
export class CreateOrderDto {
  @ValidateNested()
  address: AddressDto;
}
```

## 커스텀 Validator 규칙

기준: **DB 조회가 필요하면 서비스, 아니면 DTO 데코레이터**

| 검증 유형 | 위치 | 예시 |
|-----------|------|------|
| 형식/패턴 검증 | DTO (`@ValidatorConstraint`) | 전화번호 포맷, 사업자번호 |
| 비즈니스 규칙 검증 | 서비스 레이어 | 이메일 중복, 리소스 존재 여부 |

### 형식 검증 — DTO 데코레이터로 추출

```ts
// ✅
@ValidatorConstraint({ name: 'isKoreanPhone', async: false })
export class IsKoreanPhoneConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return /^010-\d{4}-\d{4}$/.test(value);
  }
  defaultMessage() {
    return '올바른 휴대폰 번호 형식이 아닙니다 (010-0000-0000)';
  }
}

export function IsKoreanPhone(options?: ValidationOptions): PropertyDecorator {
  return function (object, propertyName) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsKoreanPhoneConstraint,
    });
  };
}
```

### 비즈니스 규칙 검증 — 서비스에서 예외 throw

```ts
// ✅
async createUser(dto: CreateUserDto) {
  const exists = await this.userRepository.existsByEmail(dto.email);
  if (exists) throw new ConflictException('이미 사용 중인 이메일입니다');
}

// ❌ — DB 조회가 필요한 검증을 @ValidatorConstraint에서 처리
@ValidatorConstraint({ async: true })
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private userRepository: UserRepository) {}
  async validate(email: string) {
    return !(await this.userRepository.existsByEmail(email));
  }
}
```

## 에러 처리

- `exceptionFactory` 옵션 사용 금지 — 에러 응답 포맷은 전역 ExceptionFilter에서 일괄 처리한다 (→ `exception-handling.md` 참고)
- ValidationPipe는 검증 실패 시 `BadRequestException`을 그대로 throw한다
- 에러 메시지는 한국어로 작성한다

```ts
// ✅ 한국어 메시지 명시
@IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })
email: string;

// ❌ 영어 기본 메시지 사용
@IsEmail()
email: string;
```

검증 실패 응답은 `api-design.md`의 일반 규칙(`data: null`)의 예외이며, 전역 ExceptionFilter가 `data.errors` 형태로 변환한다:

```ts
// 400 응답 예시
{
  "success": false,
  "data": {
    "errors": [
      { "field": "email", "message": "올바른 이메일 형식이 아닙니다" },
      { "field": "age", "message": "나이는 0 이상이어야 합니다" }
    ]
  },
  "message": "잘못된 요청입니다"
}
```
