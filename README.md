# ai-conventions

AI 코딩 어시스턴트(Claude, Cursor 등)가 프로젝트 컨벤션을 일관성 있게 따를 수 있도록 규칙 템플릿을 제공하는 저장소입니다.

## 개요

각 프레임워크별로 네이밍, 폴더 구조, API 설계, 예외 처리 등의 컨벤션을 마크다운 템플릿으로 정의합니다. CLI를 통해 원하는 스택과 아키텍처를 선택하면 컨벤션 파일이 프로젝트에 자동으로 생성됩니다.

## 지원 스택

| 영역 | 선택지 |
|---|---|
| Frontend | React + TypeScript |
| Frontend 라우팅 | react-router (Vite/SPA), App Router (Next.js) |
| Frontend 아키텍처 | Feature-Slice Design |
| Backend | Spring Boot, NestJS |
| Backend 아키텍처 | Layered Architecture, Clean Architecture |

## 빠른 시작

```bash
npx ai-conventions-cli init
```

프롬프트에 따라 스택과 아키텍처를 선택하면 다음 파일이 프로젝트 루트에 생성됩니다.

```
your-project/
├── docs/
│   ├── naming.md
│   ├── frontend/
│   │   ├── components.md
│   │   ├── naming.md
│   │   ├── routing.md
│   │   ├── folder-structure.md
│   │   ├── state-management.md
│   │   ├── styling.md
│   │   ├── typescript.md
│   │   └── form-validation.md
│   └── backend/
│       ├── folder-structure.md
│       ├── api-design.md
│       ├── exception-handling.md
│       ├── naming.md
│       ├── response-format.md
│       └── validation.md
├── CLAUDE.md   # Claude Code용 컨벤션 참조 파일
└── AGENTS.md   # 기타 AI 어시스턴트용 컨벤션 참조 파일
```

## 템플릿 구조

```
templates/
├── common/
│   └── naming.md                      # 공통 네이밍 규칙
├── frontend/
│   ├── components.md                  # 컴포넌트 작성 규칙
│   ├── naming.md                      # 프론트엔드 네이밍 규칙
│   ├── state-management.md
│   ├── styling.md
│   ├── typescript.md
│   ├── form-validation.md
│   ├── react-router/
│   │   └── routing.md                 # Vite/SPA 라우팅 규칙
│   ├── app-router/
│   │   └── routing.md                 # Next.js App Router 규칙
│   └── folder-structure.md
└── backend/
    ├── nestjs/
    │   ├── api-design.md
    │   ├── exception-handling.md
    │   ├── naming.md
    │   ├── response-format.md
    │   ├── validation.md
    │   └── architecture/
    │       ├── layered/
    │       │   └── folder-structure.md
    │       └── clean/
    │           └── folder-structure.md
    └── spring-boot/            # (NestJS와 동일 구조)
```

## CLI 개발

```bash
cd cli
npm install
npm run dev   # ts-node로 로컬 실행
npm run build # dist/ 빌드
```

## 컨벤션 추가 방법

1. `templates/<영역>/<프레임워크>/` 아래에 마크다운 파일을 추가합니다.
2. 파일명은 컨벤션 주제를 명확히 나타내도록 합니다 (예: `error-handling.md`).
3. PR을 열어 리뷰를 요청합니다.
