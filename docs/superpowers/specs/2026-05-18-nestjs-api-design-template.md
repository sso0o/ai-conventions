# NestJS API Design Template — 설계 스펙

## 목표

`templates/backend/nestjs/api-design.md` 파일에 NestJS 프로젝트의 API 설계 규칙을 작성한다.
AI가 NestJS API를 생성할 때 참조하는 컨벤션 문서로 사용된다.

## 범위

- URL 설계 규칙 (HTTP 메서드, URL 패턴, 중첩 리소스)
- 요청 형식 (Path/Query Parameter, Request Body, 페이지네이션)
- 응답 형식 (공통 래퍼 객체, 페이지네이션 응답, HTTP 상태 코드)

## 결정 사항

| 항목 | 결정 |
|------|------|
| API 버전 관리 | 없음 |
| URL 케이스 | kebab-case |
| 페이지네이션 | offset 기반 (`page`, `size`) |
| 응답 래퍼 | `ApiResponse<T>` — `success / data / message` |

## 1. URL 설계 규칙

- 리소스는 복수형 명사 사용 (`/users`, `/orders`)
- URL 단어 구분은 kebab-case (`/user-profiles`)
- URL에 동사 금지, 행위는 HTTP 메서드로 표현

**HTTP 메서드 매핑**

| 메서드 | URL | 설명 |
|--------|-----|------|
| GET | `/users` | 목록 조회 |
| GET | `/users/:id` | 단건 조회 |
| POST | `/users` | 생성 |
| PATCH | `/users/:id` | 부분 수정 |
| DELETE | `/users/:id` | 삭제 |

**중첩 리소스** — 1단계까지만 허용
```
/orders/:orderId/order-items           ✅
/orders/:orderId/items/:itemId         ✅
/orders/:orderId/items/:itemId/reviews ❌
```

**특수 액션** — 동사 suffix 허용
```
POST /users/:id/activate
POST /orders/:id/cancel
```

## 2. 요청 형식

- **Path Parameter**: 단건 리소스 식별 (`/users/:id`)
- **Query Parameter**: 필터링, 정렬, 페이지네이션
- **Request Body**: POST/PATCH에서 JSON, DTO로 타입 정의

**페이지네이션 파라미터**

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `page` | number | 1 | 페이지 번호 (1-based) |
| `size` | number | 20 | 페이지당 항목 수 |
| `sort` | string | - | 정렬 필드명 |
| `order` | `asc` \| `desc` | `desc` | 정렬 방향 |

## 3. 응답 형식

**공통 래퍼 `ApiResponse<T>`**
```ts
{
  success: boolean
  data: T | null
  message: string
}
```

**페이지네이션 응답** — `data`에 `items` + `meta` 포함
```ts
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
  "message": "성공"
}
```

**HTTP 상태 코드 및 기본 메시지**

| 상황 | 코드 | `message` |
|------|------|-----------|
| 조회/수정/삭제 성공 | 200 | `"성공"` |
| 생성 성공 | 201 | `"생성되었습니다"` |
| 요청 값 오류 | 400 | `"잘못된 요청입니다"` |
| 인증 없음 | 401 | `"인증이 필요합니다"` |
| 권한 없음 | 403 | `"접근 권한이 없습니다"` |
| 리소스 없음 | 404 | `"리소스를 찾을 수 없습니다"` |
| 서버 오류 | 500 | `"서버 오류가 발생했습니다"` |

- `message`는 위 기본값을 사용하되, 서비스 레이어에서 커스텀 메시지 지정 가능
- 에러 응답 시 `success: false`, `data: null`로 고정
