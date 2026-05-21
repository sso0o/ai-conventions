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

## 배포

CLI는 npm 패키지(`ai-conventions-cli`)로 배포됩니다. 템플릿 변경과 CLI 코드 변경의 배포 방식이 다릅니다.

### 템플릿만 변경한 경우

`templates/` 하위 파일만 수정했다면 **npm 배포 없이** `master` 브랜치에 머지하는 것으로 충분합니다. CLI가 실행될 때 GitHub의 `master` 브랜치 tarball을 직접 다운로드하기 때문에 사용자는 항상 최신 템플릿을 받게 됩니다.

### CLI 코드를 변경한 경우

`cli/src/` 하위 파일을 수정했다면 npm 배포가 필요합니다.

```bash
# 1. cli/package.json의 version 필드를 올린다 (예: 1.0.1 → 1.0.2)

# 2. 빌드 + 배포 (prepublishOnly로 빌드가 자동 실행됨)
cd cli
npm publish
```

> npm 배포 권한이 있는 계정으로 로그인되어 있어야 합니다 (`npm whoami`로 확인).

## 컨벤션 추가 방법

1. `templates/<영역>/<프레임워크>/` 아래에 마크다운 파일을 추가합니다.
2. 파일명은 컨벤션 주제를 명확히 나타내도록 합니다 (예: `error-handling.md`).
3. PR을 열어 리뷰를 요청합니다.
