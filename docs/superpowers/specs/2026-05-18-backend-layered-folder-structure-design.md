# Backend Layered Folder Structure Design

**Date:** 2026-05-18  
**Scope:** Spring Boot + NestJS, Layered Architecture

---

## 목표

프레임워크(Spring Boot, NestJS)에 관계없이 Layered Architecture의 폴더 구조 규칙을 도메인 분리형(도메인 우선)으로 통일하고, Service 계층의 impl 패턴 사용 여부를 CLI 질문으로 선택할 수 있게 한다.

---

## 결정 사항

| 항목 | 결정 |
|------|------|
| 최상위 기준 | 도메인 (domain-separated 고정) |
| 도메인 내부 구조 | 레이어 서브폴더 (`controller/`, `service/`, `repository/`, `dto/`, `domain/`) |
| 서브도메인 중첩 | NestJS만 허용, Spring Boot는 최상위 도메인 패키지만 사용 |
| 공유 코드 위치 | Spring Boot → `common/`, NestJS → `shared/` |
| impl 선택 | Spring Boot만 CLI 질문 (`impl` / `no-impl`), NestJS는 `no-impl` 고정 |

---

## 폴더 구조 골격

**Spring Boot** (서브도메인 중첩 없음 — 복잡해지면 최상위 패키지로 분리)
```
com.example.app/
├── user/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── dto/
│   └── domain/
├── order/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── dto/
│   └── domain/
└── common/
    ├── exception/
    ├── response/
    └── util/
```

**NestJS** (서브도메인 중첩 허용)
```
src/
├── user/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── dto/
│   ├── domain/
│   └── auth/                 # 서브도메인 중첩 허용
│       ├── controller/
│       ├── service/
│       └── dto/
└── shared/
    ├── exception/
    ├── response/
    └── util/
```

---

## impl 패턴별 Service 구조

### impl 사용 (Spring Boot)
```
user/
  service/
    UserService.java           # 인터페이스
    UserServiceImpl.java       # 구현체
```

### impl 사용 안 함 (Spring Boot)
```
user/
  service/
    UserService.java           # 구현 클래스
```

### NestJS (no-impl 고정)
```
user/
  service/
    user.service.ts            # 구현 클래스 (인터페이스 분리 없음)
```

---

## 핵심 규칙

1. **최상위는 도메인** — `controller/`, `service/` 등 레이어가 루트에 오지 않는다.
2. **도메인 안에 레이어 서브폴더** — `{domain}/controller/`, `{domain}/service/`, `{domain}/repository/`, `{domain}/dto/`, `{domain}/domain/`
3. **서브도메인 중첩** — NestJS만 허용 (`{domain}/{sub-domain}/`, 동일한 레이어 서브폴더 규칙 적용). Spring Boot는 최상위 도메인 패키지만 사용하며, 도메인이 커지면 별도 최상위 패키지로 분리한다.
4. **공유 코드 위치** — Spring Boot는 `common/`, NestJS는 `shared/` (공통 예외, 유틸, 응답 포맷).
5. **비즈니스 로직은 Service만** — Controller는 요청/응답 변환만 담당한다.
6. **impl 패턴은 Spring Boot만 CLI 선택** — Spring Boot + Layered 선택 시 `impl` / `no-impl` 중 선택한다. NestJS는 `no-impl`로 고정된다.

---

## CLI 변경 사항

### `Answers` 인터페이스
```ts
// 제거
backendArchitecture: 'layered' | 'clean';
backendLayeredStyle: 'domain-integrated' | 'domain-separated';

// 추가
serviceImplStyle: 'impl' | 'no-impl';
```

### `prompt.ts` 질문 변경
- `backendArchitecture` 질문 제거 (Layered로 고정)
- `backendLayeredStyle` 질문 제거 (domain-separated로 고정)
- `serviceImplStyle` 질문 추가 — Spring Boot 선택 시 노출

```ts
{
  type: 'list',
  name: 'serviceImplStyle',
  message: 'Service 계층 구현 방식을 선택하세요:',
  choices: [
    { name: 'impl 사용 (UserService 인터페이스 + UserServiceImpl)', value: 'impl' },
    { name: 'impl 사용 안 함 (UserService 클래스 하나)', value: 'no-impl' },
  ],
  when: (answers) => answers.backend === 'spring-boot',
}
```

### `generate.ts` 라우팅 변경

Layered architecture 경로:
- Spring Boot: `spring-boot/architecture/{serviceImplStyle}/folder-structure.md`
- NestJS: `nestjs/architecture/no-impl/folder-structure.md` (고정)

---

## 템플릿 파일 구조

```
templates/backend/
├── spring-boot/
│   └── architecture/
│       ├── impl/
│       │   └── folder-structure.md    # 신규
│       └── no-impl/
│           └── folder-structure.md    # 신규 (기존 domain-separated 내용 기반)
└── nestjs/
    └── architecture/
        └── no-impl/
            └── folder-structure.md    # 신규 (no-impl 고정)
```

기존 파일 처리:
- `spring-boot/architecture/clean/` — 삭제
- `spring-boot/architecture/layered/` — 전체 삭제 (신규 구조로 대체)
- `nestjs/architecture/clean/` — 삭제
- `nestjs/architecture/layered/` — 전체 삭제 (신규 구조로 대체)

---

## 범위 밖

- Frontend 관련 변경 없음

## 제거 대상 (이번 변경으로 삭제)

- Clean Architecture 선택지 (`backendArchitecture` 질문 및 clean 템플릿 파일)
- Spring Boot `domain-integrated` 스타일
