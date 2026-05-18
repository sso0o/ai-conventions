# NestJS Layered Architecture — 도메인 분리형

도메인을 최상위 기준으로 삼고, 각 도메인 안에서 레이어별 서브디렉토리로 구분합니다.
서브도메인 중첩이 허용됩니다.

## 폴더 구조

```
src/
├── user/
│   ├── controller/
│   │   └── user.controller.ts
│   ├── service/
│   │   └── user.service.ts
│   ├── repository/
│   │   └── user.repository.ts
│   ├── dto/
│   │   ├── user-request.dto.ts
│   │   └── user-response.dto.ts
│   ├── domain/
│   │   └── user.entity.ts
│   └── auth/                           # 서브도메인 중첩 허용
│       ├── controller/
│       │   └── user-auth.controller.ts
│       ├── service/
│       │   └── user-auth.service.ts
│       └── dto/
│           └── user-auth-request.dto.ts
└── shared/
    ├── exception/
    │   └── global-exception.filter.ts
    ├── response/
    │   └── api-response.ts
    └── util/
```

## 규칙

- 최상위 디렉토리는 도메인(user / order / product …)으로 구분한다.
- 도메인 안에서 레이어별 서브디렉토리(controller / service / repository / dto / domain)로 구분한다.
- Service 계층은 구현 클래스 하나로 관리한다 (인터페이스 분리 없음).
- 서브도메인 중첩이 허용된다 (`{domain}/{sub-domain}/`). 서브도메인 안에서도 동일한 레이어 서브디렉토리 규칙을 적용한다.
- 도메인 간 공유 코드(공통 예외, 유틸 등)는 `shared` 디렉토리에 둔다.
- 비즈니스 로직은 Service 계층에서만 작성하고 Controller는 요청/응답 변환만 담당한다.
