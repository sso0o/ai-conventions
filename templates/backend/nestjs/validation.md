# NestJS Validation

## ValidationPipe 전역 설정

`main.ts`에서 한 번만 설정한다. 컨트롤러 또는 핸들러 단위 `@UsePipes()` 사용을 금지한다.

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
