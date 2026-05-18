# Naming Conventions (Common)

## 기본 케이스 규칙

| 대상 | 규칙 | 예시 |
|---|---|---|
| 변수 | camelCase | userName, totalCount |
| 상수 | UPPER_SNAKE_CASE | MAX_RETRY_COUNT, API_BASE_URL |
| 클래스 / 타입 / 인터페이스 | PascalCase | UserService, ApiResponse |
| 함수 / 메서드 | camelCase | getUserById, calculateTotal |

## 불리언 변수

- `is`, `has`, `can`, `should` prefix 사용
- 부정형 금지

```
// ✅
isLoading
hasPermission
canEdit
shouldRefresh
// ❌
loading
notFound
disable
```

## 약어 규칙

- 널리 알려진 약어만 허용 (id, url, api, dto)
- 그 외 약어 사용 금지, 풀네임 사용

```
// ✅
userId
apiUrl
// ❌
usrId
btnClk
```

## 복수형

- 배열/컬렉션은 복수형 사용

```
// ✅
userList, users
orderItems
// ❌
userArr, userArray
```