# ai-conventions

AI 코딩 어시스턴트(Claude, Cursor 등)가 프로젝트 컨벤션을 일관성 있게 따를 수 있도록 규칙 템플릿을 제공하는 저장소입니다.

## 개요

각 프레임워크별로 네이밍, 폴더 구조, API 설계, 예외 처리 등의 컨벤션을 마크다운 템플릿으로 정의합니다. CLI를 통해 원하는 스택에 맞는 컨벤션 파일을 프로젝트에 바로 생성할 수 있습니다.

## 지원 스택

| 영역 | 프레임워크 |
|---|---|
| Frontend | Next.js, Vite |
| Backend | NestJS, Spring Boot |

## 빠른 시작

```bash
npx ai-conventions-cli init
```

프롬프트에 따라 스택과 아키텍처를 선택하면 컨벤션 파일이 프로젝트 루트에 생성됩니다.

## 템플릿 구조

```
templates/
├── common/
│   └── naming.md              # 공통 네이밍 규칙
├── frontend/
│   ├── nextjs/
│   │   ├── architecture/      # clean / feature-slice 폴더 구조
│   │   ├── components.md
│   │   ├── naming.md
│   │   ├── routing.md
│   │   ├── state-management.md
│   │   ├── styling.md
│   │   ├── typescript.md
│   │   └── form-validation.md
│   └── vite/                  # (Next.js와 동일 구조)
└── backend/
    ├── nestjs/
    │   ├── architecture/      # clean / layered 폴더 구조
    │   ├── api-design.md
    │   ├── exception-handling.md
    │   ├── naming.md
    │   ├── response-format.md
    │   └── validation.md
    └── spring-boot/           # (NestJS와 동일 구조)
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
