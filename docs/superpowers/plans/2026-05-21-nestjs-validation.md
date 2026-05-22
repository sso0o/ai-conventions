# NestJS Validation Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `templates/backend/nestjs/validation.md`에 NestJS 검증 규칙 템플릿을 작성한다.

**Architecture:** 총 4개 섹션으로 구성된 마크다운 파일을 작성한다. 각 섹션은 (1) ValidationPipe 전역 설정, (2) DTO 작성 규칙, (3) 커스텀 Validator 규칙, (4) 에러 처리 순으로 구성된다. 기존 `api-design.md`와 동일한 스타일(한국어, ✅/❌ 예시, 테이블)을 따른다.

**Tech Stack:** Markdown, class-validator, class-transformer, NestJS ValidationPipe

---

## 파일 구조

| 파일 | 작업 |
|------|------|
| `templates/backend/nestjs/validation.md` | 수정 (현재 1줄 주석만 있음) |

---

### Task 1: ValidationPipe 전역 설정 섹션 작성

**Files:**
- Modify: `templates/backend/nestjs/validation.md`

- [ ] **Step 1: 파일 첫 섹션 작성**

`templates/backend/nestjs/validation.md`를 아래 내용으로 교체한다:

```markdown
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
```

- [ ] **Step 2: 내용 확인**

파일을 열어 섹션이 올바르게 작성됐는지 확인한다.

- [ ] **Step 3: Commit**

```bash
git add templates/backend/nestjs/validation.md
git commit -m "docs: add nestjs validation pipe setup section"
```

---

### Task 2: DTO 작성 규칙 섹션 작성

**Files:**
- Modify: `templates/backend/nestjs/validation.md`

- [ ] **Step 1: DTO 규칙 섹션 추가**

Task 1에서 작성한 내용 아래에 다음을 이어 붙인다:

```markdown
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
```

- [ ] **Step 2: 내용 확인**

파일을 열어 섹션이 올바르게 이어지는지 확인한다.

- [ ] **Step 3: Commit**

```bash
git add templates/backend/nestjs/validation.md
git commit -m "docs: add dto writing rules section to nestjs validation"
```

---

### Task 3: 커스텀 Validator 규칙 섹션 작성

**Files:**
- Modify: `templates/backend/nestjs/validation.md`

- [ ] **Step 1: 커스텀 Validator 섹션 추가**

Task 2 내용 아래에 다음을 이어 붙인다:

```markdown
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
  return applyDecorators(Validate(IsKoreanPhoneConstraint, options));
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
```

- [ ] **Step 2: 내용 확인**

파일을 열어 테이블과 코드 블록이 올바르게 렌더링되는지 확인한다.

- [ ] **Step 3: Commit**

```bash
git add templates/backend/nestjs/validation.md
git commit -m "docs: add custom validator rules section to nestjs validation"
```

---

### Task 4: 에러 처리 섹션 작성

**Files:**
- Modify: `templates/backend/nestjs/validation.md`

- [ ] **Step 1: 에러 처리 섹션 추가**

Task 3 내용 아래에 다음을 이어 붙인다:

```markdown
## 에러 처리

- `exceptionFactory` 옵션 사용 금지 — 에러 응답 포맷은 전역 ExceptionFilter에서 일괄 처리한다 (→ `exception-handling.md` 참고)
- ValidationPipe는 검증 실패 시 raw `BadRequestException`을 그대로 throw한다
- 에러 메시지는 한국어로 작성한다

```ts
// ✅ 한국어 메시지 명시
@IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })
email: string;

// ❌ 영어 기본 메시지 사용
@IsEmail()
email: string;
```

전역 ExceptionFilter가 ValidationPipe의 에러를 아래 형태로 변환한다:

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
```

- [ ] **Step 2: 최종 파일 전체 확인**

파일 전체를 읽어 4개 섹션이 순서대로 올바르게 작성됐는지 확인한다.

- [ ] **Step 3: Commit**

```bash
git add templates/backend/nestjs/validation.md
git commit -m "docs: add error handling section to nestjs validation"
```

---

## 완료 기준

- `templates/backend/nestjs/validation.md`에 4개 섹션이 모두 작성됨
- `api-design.md`와 동일한 스타일(한국어, ✅/❌ 예시, 테이블) 사용
- `exception-handling.md` 참조 링크 포함
