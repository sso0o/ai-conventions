# Naming Conventions (React + TypeScript)

## 파일 / 폴더명

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 파일 | PascalCase | UserCard.tsx, LoginForm.tsx |
| 훅 파일 | camelCase | useAuth.ts, useFetchUser.ts |
| 유틸 / 헬퍼 파일 | camelCase | formatDate.ts, calcTotal.ts |
| 상수 파일 | camelCase | apiEndpoints.ts, errorMessages.ts |
| 타입 파일 | camelCase | userTypes.ts, apiTypes.ts |
| 폴더명 | kebab-case | user-profile/, auth-modal/ |

## 컴포넌트

- PascalCase 사용
- 역할이 드러나는 명사형으로 작성

```
// ✅
UserProfileCard
LoginForm
OrderSummaryList
// ❌
userCard
Card1
DoLogin
```

## 훅

- `use` prefix 필수
- 동사 또는 명사형

```
// ✅
useAuth
useFetchUser
useModalState
// ❌
authHook
fetchUser
```

## 이벤트 핸들러

- `handle` prefix 사용 (컴포넌트 내부 함수)
- `on` prefix 사용 (props로 전달받는 함수)

```typescript
// ✅
const handleSubmit = () => {}
const handleInputChange = () => {}
<Button onClick={handleSubmit} />
<Input onChange={handleInputChange} />
// props
interface Props {
onSubmit: () => void
onChange: (value: string) => void
}
// ❌
const clickButton = () => {}
const submitAction = () => {}
```

## 타입 / 인터페이스

- PascalCase 사용
- `I` prefix 금지
- props 타입은 `{ComponentName}Props`

```typescript
// ✅
type User = {}
interface ApiResponse {}
interface UserCardProps {}
// ❌
IUser
TUser
userProps
```

## 상수

- UPPER_SNAKE_CASE
- 파일 내 지역 상수도 동일 적용

```typescript
// ✅
const MAX_PAGE_SIZE = 20
const DEFAULT_LOCALE = 'ko'
// ❌
const maxPageSize = 20
const defaultLocale = 'ko'
```
