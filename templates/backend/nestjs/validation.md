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
