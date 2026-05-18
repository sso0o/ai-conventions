# Frontend Architecture 단순화 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 프론트엔드 아키텍처 선택지(Layered/Feature-Slice)를 제거하고 Feature-Slice 단일 구조로 통합한다.

**Architecture:** 템플릿 파일을 `architecture/feature-slice/` 하위에서 `frontend/` 직하로 이동하여 CLI의 아키텍처 분기 로직을 완전히 제거한다. generate.ts의 공통 파일 루프가 이미 `frontend/*.md`를 자동 복사하므로 이동 후 별도 코드 추가 없이 동작한다.

**Tech Stack:** Node.js, TypeScript, inquirer, fs-extra

---

### Task 1: 템플릿 파일 이동 및 `architecture/` 디렉토리 삭제

**Files:**
- Create: `templates/frontend/folder-structure.md` (feature-slice 내용으로)
- Delete: `templates/frontend/architecture/` (하위 전체)

- [ ] **Step 1: feature-slice folder-structure.md 내용을 frontend/ 직하로 복사**

PowerShell:
```powershell
Copy-Item "templates\frontend\architecture\feature-slice\folder-structure.md" "templates\frontend\folder-structure.md"
```

- [ ] **Step 2: 파일이 올바르게 복사됐는지 확인**

```powershell
Get-Content "templates\frontend\folder-structure.md" | Select-Object -First 5
```

Expected: `# 폴더 구조` 로 시작하는 내용 출력

- [ ] **Step 3: architecture/ 디렉토리 전체 삭제**

```powershell
Remove-Item -Recurse -Force "templates\frontend\architecture"
```

- [ ] **Step 4: 삭제 확인**

```powershell
Test-Path "templates\frontend\architecture"
```

Expected: `False`

- [ ] **Step 5: Commit**

```bash
git add templates/frontend/folder-structure.md
git rm -r templates/frontend/architecture/
git commit -m "move: frontend folder-structure to frontend/ root, remove architecture/ dir"
```

---

### Task 2: `cli/src/prompt.ts` 수정

**Files:**
- Modify: `cli/src/prompt.ts`

- [ ] **Step 1: `Answers` 타입에서 `frontendArchitecture` 제거**

`cli/src/prompt.ts` 의 `Answers` 인터페이스를:
```ts
export interface Answers {
  frontend: 'react-typescript' | 'none';
  frontendRouting: 'react-router' | 'app-router';
  backend: 'spring-boot' | 'nestjs' | 'none';
  backendArchitecture: 'layered' | 'clean';
  backendLayeredStyle: 'domain-integrated' | 'domain-separated';
}
```
로 변경 (`frontendArchitecture` 필드 제거)

- [ ] **Step 2: `inquirer.prompt` 배열에서 `frontendArchitecture` 질문 제거**

아래 블록 전체를 삭제:
```ts
{
  type: 'list',
  name: 'frontendArchitecture',
  message: '프론트엔드 아키텍처를 선택하세요:',
  choices: [
    { name: 'Layered Architecture', value: 'layered' },
    { name: 'Feature-Slice Design', value: 'feature-slice' },
  ],
  when: (answers) => answers.frontend !== 'none',
},
```

- [ ] **Step 3: `return` 문에서 `frontendArchitecture` fallback 제거**

```ts
return {
  ...raw,
  frontendRouting: (raw.frontendRouting as string | undefined) ?? 'react-router',
  backendArchitecture: (raw.backendArchitecture as string | undefined) ?? 'layered',
  backendLayeredStyle: (raw.backendLayeredStyle as string | undefined) ?? 'domain-integrated',
} as Answers;
```
(`frontendArchitecture: (raw.frontendArchitecture as string | undefined) ?? 'layered'` 줄 제거)

- [ ] **Step 4: TypeScript 컴파일 확인**

```bash
cd cli && npx tsc --noEmit
```

Expected: 오류 없음

- [ ] **Step 5: Commit**

```bash
git add cli/src/prompt.ts
git commit -m "refactor: remove frontendArchitecture prompt and type field"
```

---

### Task 3: `cli/src/generate.ts` 수정

**Files:**
- Modify: `cli/src/generate.ts`

- [ ] **Step 1: `copyFrontend()` 내 아키텍처 분기 블록 삭제**

`copyFrontend()` 함수에서 아래 블록 전체를 삭제:
```ts
// Architecture folder structure
const archPath = path.join(frontendSrc, 'architecture', answers.frontendArchitecture, 'folder-structure.md');
const fallbackPath = path.join(frontendSrc, 'architecture', 'layered', 'folder-structure.md');
const resolvedArch = fse.pathExistsSync(archPath) ? archPath : fallbackPath;

if (fse.pathExistsSync(resolvedArch)) {
  fse.copySync(resolvedArch, path.join(dst, 'folder-structure.md'));
  copiedFiles.push('docs/frontend/folder-structure.md');
}
```

삭제 후 `copyFrontend()`는 다음과 같이 됩니다:
```ts
function copyFrontend(
  answers: Answers,
  templateDir: string,
  docsDir: string,
  copiedFiles: string[]
): void {
  const frontendSrc = path.join(templateDir, 'templates', 'frontend');
  const dst = path.join(docsDir, 'frontend');
  fse.ensureDirSync(dst);

  // Common frontend .md files directly under templates/frontend/
  for (const file of fse.readdirSync(frontendSrc)) {
    const srcPath = path.join(frontendSrc, file);
    if (fse.statSync(srcPath).isFile() && file.endsWith('.md')) {
      fse.copySync(srcPath, path.join(dst, file));
      copiedFiles.push(`docs/frontend/${file}`);
    }
  }

  // Routing file based on selected routing strategy
  const routingPath = path.join(frontendSrc, answers.frontendRouting, 'routing.md');
  if (fse.pathExistsSync(routingPath)) {
    fse.copySync(routingPath, path.join(dst, 'routing.md'));
    copiedFiles.push('docs/frontend/routing.md');
  }
}
```

- [ ] **Step 2: TypeScript 컴파일 확인**

```bash
cd cli && npx tsc --noEmit
```

Expected: 오류 없음

- [ ] **Step 3: `folder-structure.md`가 공통 루프에서 복사되는지 동작 검증**

```bash
cd cli && npx ts-node src/index.ts
```

프론트엔드를 선택 후 생성된 `docs/frontend/folder-structure.md`가 존재하는지 확인.

- [ ] **Step 4: Commit**

```bash
git add cli/src/generate.ts
git commit -m "refactor: remove frontend architecture branching logic from generate.ts"
```

---

### Task 4: `README.md` 업데이트

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 지원 스택 표에서 Layered Architecture 행 제거**

변경 전:
```md
| Frontend 아키텍처 | Layered Architecture, Feature-Slice Design |
```

변경 후:
```md
| Frontend 아키텍처 | Feature-Slice Design |
```

- [ ] **Step 2: 템플릿 구조 다이어그램 업데이트**

변경 전:
```
│   └── architecture/
│       ├── layered/
│       │   └── folder-structure.md
│       └── feature-slice/
│           └── folder-structure.md
```

변경 후:
```
│   └── folder-structure.md
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: update README to reflect single frontend architecture"
```
