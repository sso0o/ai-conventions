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
| 서브도메인 중첩 | 허용 (`user/auth/`, `user/profile/` 등) |
| 공유 코드 위치 | Spring Boot → `common/`, NestJS → `shared/` |
| impl 선택 | CLI 질문으로 `impl` / `no-impl` 선택 |

---

## 폴더 구조 골격

```
src/
├── {domain}/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── dto/
│   ├── domain/
│   └── {sub-domain}/         # 중첩 허용
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── dto/
│       └── domain/
└── common/                   # Spring Boot 공유 코드
    ├── exception/
    ├── response/
    └── util/
```

```
src/
├── {domain}/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── dto/
│   ├── domain/
│   └── {sub-domain}/
└── shared/                   # NestJS 공유 코드
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

### impl 사용 (NestJS)
```
user/
  service/
    user.service.ts            # 인터페이스
    user.service.impl.ts       # 구현체
```

### impl 사용 안 함 (NestJS)
```
user/
  service/
    user.service.ts            # 구현 클래스
```

---

## 핵심 규칙

1. **최상위는 도메인** — `controller/`, `service/` 등 레이어가 루트에 오지 않는다.
2. **도메인 안에 레이어 서브폴더** — `{domain}/controller/`, `{domain}/service/`, `{domain}/repository/`, `{domain}/dto/`, `{domain}/domain/`
3. **서브도메인 중첩 허용** — 도메인이 커질 경우 `{domain}/{sub-domain}/` 구조로 분리하며, 동일한 레이어 서브폴더 규칙을 적용한다.
4. **공유 코드 위치** — Spring Boot는 `common/`, NestJS는 `shared/` (공통 예외, 유틸, 응답 포맷).
5. **비즈니스 로직은 Service만** — Controller는 요청/응답 변환만 담당한다.
6. **impl 패턴은 CLI 선택** — 프로젝트 생성 시 `impl` / `no-impl` 중 선택하며, 선택에 따라 해당 템플릿이 적용된다.

---

## CLI 변경 사항

### `Answers` 인터페이스
```ts
// 제거
backendLayeredStyle: 'domain-integrated' | 'domain-separated';

// 추가
serviceImplStyle: 'impl' | 'no-impl';
```

### `prompt.ts` 질문 변경
- `backendLayeredStyle` 질문 제거 (domain-separated로 고정)
- `serviceImplStyle` 질문 추가 — `backendArchitecture === 'layered'`일 때 노출

```ts
{
  type: 'list',
  name: 'serviceImplStyle',
  message: 'Service 계층 구현 방식을 선택하세요:',
  choices: [
    { name: 'impl 사용 (UserService 인터페이스 + UserServiceImpl)', value: 'impl' },
    { name: 'impl 사용 안 함 (UserService 클래스 하나)', value: 'no-impl' },
  ],
  when: (answers) => answers.backendArchitecture === 'layered',
}
```

### `generate.ts` 라우팅 변경

Layered architecture 경로:
```
{framework}/architecture/layered/{serviceImplStyle}/folder-structure.md
```

---

## 템플릿 파일 구조

```
templates/backend/
├── spring-boot/
│   └── architecture/
│       └── layered/
│           ├── impl/
│           │   └── folder-structure.md    # 신규
│           └── no-impl/
│               └── folder-structure.md    # 신규 (기존 domain-separated 내용 기반)
└── nestjs/
    └── architecture/
        └── layered/
            ├── impl/
            │   └── folder-structure.md    # 신규
            └── no-impl/
                └── folder-structure.md    # 신규
```

기존 파일 처리:
- `spring-boot/architecture/layered/domain-integrated/` — 삭제
- `spring-boot/architecture/layered/domain-separated/` — 내용을 `no-impl/`로 이전 후 삭제
- `nestjs/architecture/layered/folder-structure.md` — 빈 파일이므로 삭제

---

## 범위 밖

- Clean Architecture 폴더 구조 변경 없음
- Frontend 관련 변경 없음
- Spring Boot `domain-integrated` 스타일은 이번 변경으로 제거됨
