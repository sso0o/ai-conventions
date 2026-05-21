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
