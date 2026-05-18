# Spring Boot Layered Architecture — 도메인 분리형 (impl 미사용)

도메인을 최상위 기준으로 삼고, 각 도메인 안에서 레이어별 서브패키지로 구분합니다.
Service 계층은 구현 클래스 하나로 관리합니다.

## 폴더 구조

```
com.example.app/
├── user/
│   ├── controller/
│   │   └── UserController.java
│   ├── service/
│   │   └── UserService.java        # 구현 클래스
│   ├── repository/
│   │   └── UserRepository.java
│   ├── dto/
│   │   ├── UserRequest.java
│   │   └── UserResponse.java
│   └── domain/
│       └── User.java
└── common/
    ├── exception/
    │   └── GlobalExceptionHandler.java
    ├── response/
    │   └── ApiResponse.java
    └── util/
```

## 규칙

- 최상위 패키지는 도메인(user / order / product …)으로 구분한다.
- 도메인 안에서 레이어별 서브패키지(controller / service / repository / dto / domain)로 구분한다.
- Service 계층은 구현 클래스 하나로 관리한다 (인터페이스 분리 없음).
- 도메인이 커질 경우 별도 최상위 패키지로 분리한다. 패키지 중첩은 사용하지 않는다.
- 도메인 간 공유 코드(공통 예외, 유틸 등)는 `common` 패키지에 둔다.
- 비즈니스 로직은 Service 계층에서만 작성하고 Controller는 요청/응답 변환만 담당한다.
