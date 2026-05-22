# ai-conventions-cli

[![npm](https://img.shields.io/npm/v/ai-conventions-cli)](https://www.npmjs.com/package/ai-conventions-cli)

Generate AI coding assistant convention files (`CLAUDE.md`, `AGENTS.md`, `docs/`) for your project.  
AI 코딩 어시스턴트(Claude, Cursor 등)가 프로젝트 컨벤션을 따르도록 규칙 파일을 자동으로 생성합니다.

## Supported Stacks

| Category | Options |
|----------|---------|
| Frontend | React + TypeScript — Vite/SPA (`react-router`), Next.js (`App Router`) |
| Backend | Spring Boot, NestJS |
| Service layer | Spring Boot only: with `ServiceImpl` interface / without |

## Installation

```bash
npm install -g ai-conventions-cli
```

## Usage

Run in the root of your project:

```bash
npx ai-conventions init
```

Interactive prompts will guide you through stack selection.  
프로젝트 루트에서 실행하면 스택을 선택하는 대화형 프롬프트가 시작됩니다.

## Generated Output

```
your-project/
├── docs/
│   ├── naming.md
│   ├── frontend/
│   │   ├── components.md
│   │   ├── routing.md
│   │   └── ...
│   └── backend/
│       ├── api-design.md
│       ├── exception-handling.md
│       └── ...
├── CLAUDE.md
└── AGENTS.md
```

`CLAUDE.md` and `AGENTS.md` are generated with `@docs/...` references so Claude Code, Cursor, and other AI assistants automatically read all convention files.  
`CLAUDE.md`와 `AGENTS.md`는 `@docs/...` 참조 형식으로 생성되어 Claude Code, Cursor 등의 AI 어시스턴트가 모든 컨벤션 파일을 자동으로 읽습니다.

## Contributing

Templates live under `templates/`. Add or edit `.md` files there — no code changes needed for existing stacks.  
`templates/` 아래의 `.md` 파일을 추가하거나 수정하면 됩니다. 기존 스택의 경우 코드 변경 없이 템플릿만 수정하면 됩니다.
