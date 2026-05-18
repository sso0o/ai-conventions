# NestJS API Design Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `templates/backend/nestjs/api-design.md`에 NestJS API 설계 규칙 템플릿을 작성한다.

**Architecture:** 기존 `templates/backend/nestjs/architecture/no-impl/folder-structure.md`와 동일한 스타일(한국어 제목, 규칙 목록, ✅/❌ 예시 코드 블록)을 따른다. URL 규칙, 요청 형식, 응답 형식 세 섹션으로 구성한다.

**Tech Stack:** Markdown, NestJS

---

### Task 1: api-design.md 템플릿 작성

**Files:**
- Modify: `templates/backend/nestjs/api-design.md`

- [ ] **Step 1: URL 설계 규칙 섹션 작성**

`templates/backend/nestjs/api-design.md`를 아래 내용으로 작성한다:

```markdown
# NestJS API Design

## URL 설계 규칙

- 리소스는 **복수형 명사** 사용
- URL 단어 구분은 **kebab-case**
- URL에 동사 사용 금지 — 행위는 HTTP 메서드로 표현

### HTTP 메서드 매핑

| 메서드 | URL | 설명 |
|--------|-----|------|
| GET | `/users` | 목록 조회 |
| GET | `/users/:id` | 단건 조회 |
| POST | `/users` | 생성 |
| PATCH | `/users/:id` | 부분 수정 |
| DELETE | `/users/:id` | 삭제 |

### 중첩 리소스

1단계 중첩까지만 허용한다.

```
// ✅
/orders/:orderId/order-items
/orders/:orderId/items/:itemId

// ❌
/orders/:orderId/items/:itemId/reviews
```

### 특수 액션

동사 suffix를 URL 끝에 붙이는 방식으로 표현한다.

```
POST /users/:id/activate
POST /orders/:id/cancel
```

## 요청 형식

- **Path Parameter**: 단건 리소스 식별에 사용 (`/users/:id`)
- **Query Parameter**: 필터링, 정렬, 페이지네이션에 사용
- **Request Body**: POST/PATCH에서 JSON 사용, DTO로 타입 정의

### 페이지네이션 파라미터

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `page` | number | 1 | 페이지 번호 (1-based) |
| `size` | number | 20 | 페이지당 항목 수 |
| `sort` | string | - | 정렬 기준 필드명 |
| `order` | `asc` \| `desc` | `desc` | 정렬 방향 |

```
// ✅
GET /users?page=1&size=20
GET /users?page=1&size=20&sort=createdAt&order=desc
```

## 응답 형식

모든 응답은 공통 래퍼 `ApiResponse<T>`를 사용한다.

### ApiResponse\<T\>

```ts
{
  success: boolean
  data: T | null
  message: string
}
```

### 성공 응답 예시

```ts
// GET /users/:id → 200
{
  "success": true,
  "data": { "id": 1, "name": "홍길동", "email": "user@example.com" },
  "message": "요청 성공"
}

// POST /users → 201
{
  "success": true,
  "data": { "id": 1, "name": "홍길동" },
  "message": "생성되었습니다"
}

// DELETE /users/:id → 200
{
  "success": true,
  "data": null,
  "message": "요청 성공"
}
```

### 페이지네이션 응답

`data`에 `items`와 `meta`를 포함한다.

```ts
// GET /users?page=1&size=20 → 200
{
  "success": true,
  "data": {
    "items": [...],
    "meta": {
      "page": 1,
      "size": 20,
      "totalCount": 100,
      "totalPages": 5
    }
  },
  "message": "요청 성공"
}
```

### HTTP 상태 코드 및 기본 메시지

| 상황 | 코드 | `message` |
|------|------|-----------|
| 조회/수정/삭제 성공 | 200 | `"요청 성공"` |
| 생성 성공 | 201 | `"생성되었습니다"` |
| 요청 값 오류 | 400 | `"잘못된 요청입니다"` |
| 인증 없음 | 401 | `"인증이 필요합니다"` |
| 권한 없음 | 403 | `"접근 권한이 없습니다"` |
| 리소스 없음 | 404 | `"리소스를 찾을 수 없습니다"` |
| 서버 오류 | 500 | `"서버 오류가 발생했습니다"` |

## 규칙

- `message`는 위 기본값을 사용하되, 서비스 레이어에서 커스텀 메시지 지정 가능
- 에러 응답 시 `success: false`, `data: null`로 고정
- API 버전 관리를 하지 않는다 (URL prefix `/v1` 등 사용 금지)
```

- [ ] **Step 2: 파일 저장 확인**

`templates/backend/nestjs/api-design.md` 파일이 올바르게 작성되었는지 확인한다.

- [ ] **Step 3: Commit**

```bash
git add templates/backend/nestjs/api-design.md
git commit -m "feat: add nestjs api-design template"
```
