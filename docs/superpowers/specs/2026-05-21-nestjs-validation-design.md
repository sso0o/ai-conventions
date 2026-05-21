# NestJS Validation 규칙 설계

## 개요

`templates/backend/nestjs/validation.md`에 담을 NestJS 검증 규칙을 정의한다.

## 결정 사항

| 항목 | 결정 |
|------|------|
| ValidationPipe 적용 범위 | 전역 (Global) |
| whitelist | true |
| forbidNonWhitelisted | true |
| transform | true |
| 커스텀 validator | 형식 → DTO 데코레이터, 비즈니스 규칙 → 서비스 |
| 에러 포맷 변환 | 전역 ExceptionFilter (exception-handling.md에서 정의) |
| 에러 메시지 언어 | 한국어 |

---

## 섹션 1 — ValidationPipe 전역 설정

`main.ts`에서 한 번만 설정하며, 컨트롤러/핸들러 단위 `@UsePipes()` 사용을 금지한다.

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

- `whitelist: true` — DTO에 없는 필드 자동 제거
- `forbidNonWhitelisted: true` — DTO에 없는 필드 요청 시 400 반환
- `transform: true` — 문자열 쿼리 파라미터를 DTO 선언 타입으로 자동 변환

---

## 섹션 2 — DTO 작성 규칙

- 모든 요청 바디와 쿼리 파라미터는 class로 정의한다
- 선택적 필드는 반드시 `@IsOptional()`을 명시한다
- 쿼리 파라미터의 숫자 타입은 `@Type(() => Number)`를 함께 선언한다
- 중첩 객체는 `@ValidateNested()` + `@Type()`을 함께 사용한다 (`@Type()` 누락 시 내부 검증 동작 안 함)

---

## 섹션 3 — 커스텀 Validator 규칙

기준: **DB 조회가 필요하면 서비스, 아니면 DTO 데코레이터**

- 형식/패턴 검증 → `@ValidatorConstraint`로 재사용 가능한 데코레이터 작성
- 비즈니스 규칙 검증 → 서비스 레이어에서 예외 throw
- 에러 메시지는 한국어로 작성 (`defaultMessage()` 또는 데코레이터 `message` 옵션)

---

## 섹션 4 — 에러 처리

- `exceptionFactory` 옵션 사용 금지
- ValidationPipe는 raw `BadRequestException`을 throw하고, 응답 포맷 변환은 전역 ExceptionFilter가 담당
- 필드별 에러 상세는 `data.errors` 배열로 노출

```ts
// 400 응답 형태
{
  "success": false,
  "data": {
    "errors": [
      { "field": "email", "message": "올바른 이메일 형식이 아닙니다" }
    ]
  },
  "message": "잘못된 요청입니다"
}
```

---

## 연관 파일

- `templates/backend/nestjs/validation.md` — 구현 대상
- `templates/backend/nestjs/exception-handling.md` — ExceptionFilter 및 에러 포맷 규칙 (별도 작성 예정)
