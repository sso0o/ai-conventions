# Backend Layered Folder Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 백엔드 템플릿 폴더 구조를 도메인 분리형(도메인 우선)으로 통일하고, Spring Boot의 impl 패턴 여부를 CLI 질문으로 선택하도록 변경한다.

**Architecture:** 기존 `architecture/layered/{style}/` 경로를 `architecture/{impl|no-impl}/`로 단순화하고, Clean Architecture 선택지를 제거한다. CLI `prompt.ts`에서 `backendArchitecture`, `backendLayeredStyle` 질문을 제거하고 `serviceImplStyle` 질문을 추가한다. `generate.ts`는 새 경로로 라우팅한다.

**Tech Stack:** TypeScript, Node.js, inquirer (CLI 질문), fs-extra (파일 복사)

---

## File Map

| 파일 | 변경 유형 | 내용 |
|------|-----------|------|
| `cli/src/prompt.ts` | 수정 | Answers 인터페이스 및 질문 변경 |
| `cli/src/generate.ts` | 수정 | copyBackend 라우팅 경로 변경 |
| `templates/backend/spring-boot/architecture/impl/folder-structure.md` | 신규 | Spring Boot impl 템플릿 |
| `templates/backend/spring-boot/architecture/no-impl/folder-structure.md` | 신규 | Spring Boot no-impl 템플릿 |
| `templates/backend/nestjs/architecture/no-impl/folder-structure.md` | 신규 | NestJS 템플릿 |
| `templates/backend/spring-boot/architecture/clean/` | 삭제 | Clean Architecture 제거 |
| `templates/backend/spring-boot/architecture/layered/` | 삭제 | 구 구조 제거 |
| `templates/backend/nestjs/architecture/clean/` | 삭제 | Clean Architecture 제거 |
| `templates/backend/nestjs/architecture/layered/` | 삭제 | 구 구조 제거 |

---

### Task 1: 기존 템플릿 디렉토리 삭제

**Files:**
- Delete: `templates/backend/spring-boot/architecture/clean/`
- Delete: `templates/backend/spring-boot/architecture/layered/`
- Delete: `templates/backend/nestjs/architecture/clean/`
- Delete: `templates/backend/nestjs/architecture/layered/`

- [ ] **Step 1: 삭제 대상 확인**

```powershell
Get-ChildItem templates/backend -Recurse -Directory | Select-Object FullName
```

Expected: `clean/`, `layered/` 디렉토리들이 보임

- [ ] **Step 2: 삭제 실행**

```powershell
Remove-Item -Recurse -Force templates/backend/spring-boot/architecture/clean
Remove-Item -Recurse -Force templates/backend/spring-boot/architecture/layered
Remove-Item -Recurse -Force templates/backend/nestjs/architecture/clean
Remove-Item -Recurse -Force templates/backend/nestjs/architecture/layered
```

- [ ] **Step 3: 삭제 확인**

```powershell
Get-ChildItem templates/backend -Recurse -Directory | Select-Object FullName
```

Expected: `clean/`, `layered/` 디렉토리가 없음

- [ ] **Step 4: Commit**

```bash
git add -A templates/backend
git commit -m "chore: remove clean architecture and old layered template directories"
```

---

### Task 2: Spring Boot impl 템플릿 작성

**Files:**
- Create: `templates/backend/spring-boot/architecture/impl/folder-structure.md`

- [ ] **Step 1: 디렉토리 생성 및 파일 작성**

`templates/backend/spring-boot/architecture/impl/folder-structure.md` 를 아래 내용으로 생성:

```markdown
# Spring Boot Layered Architecture — 도메인 분리형 (impl 사용)

도메인을 최상위 기준으로 삼고, 각 도메인 안에서 레이어별 서브패키지로 구분합니다.
Service 계층은 인터페이스와 구현체로 분리합니다.

## 폴더 구조

​```
com.example.app/
├── user/
│   ├── controller/
│   │   └── UserController.java
│   ├── service/
│   │   ├── UserService.java        # 인터페이스
│   │   └── UserServiceImpl.java    # 구현체
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
​```

## 규칙

- 최상위 패키지는 도메인(user / order / product …)으로 구분한다.
- 도메인 안에서 레이어별 서브패키지(controller / service / repository / dto / domain)로 구분한다.
- Service 계층은 인터페이스(`UserService`)와 구현체(`UserServiceImpl`)로 분리한다.
- 도메인이 커질 경우 별도 최상위 패키지로 분리한다. 패키지 중첩은 사용하지 않는다.
- 도메인 간 공유 코드(공통 예외, 유틸 등)는 `common` 패키지에 둔다.
- 비즈니스 로직은 Service 계층에서만 작성하고 Controller는 요청/응답 변환만 담당한다.
```

- [ ] **Step 2: 파일 확인**

```powershell
Get-Content templates/backend/spring-boot/architecture/impl/folder-structure.md
```

Expected: 위 내용이 출력됨

- [ ] **Step 3: Commit**

```bash
git add templates/backend/spring-boot/architecture/impl/folder-structure.md
git commit -m "feat: add spring-boot impl folder-structure template"
```

---

### Task 3: Spring Boot no-impl 템플릿 작성

**Files:**
- Create: `templates/backend/spring-boot/architecture/no-impl/folder-structure.md`

- [ ] **Step 1: 파일 작성**

`templates/backend/spring-boot/architecture/no-impl/folder-structure.md` 를 아래 내용으로 생성:

```markdown
# Spring Boot Layered Architecture — 도메인 분리형 (impl 미사용)

도메인을 최상위 기준으로 삼고, 각 도메인 안에서 레이어별 서브패키지로 구분합니다.
Service 계층은 구현 클래스 하나로 관리합니다.

## 폴더 구조

​```
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
​```

## 규칙

- 최상위 패키지는 도메인(user / order / product …)으로 구분한다.
- 도메인 안에서 레이어별 서브패키지(controller / service / repository / dto / domain)로 구분한다.
- Service 계층은 구현 클래스 하나로 관리한다 (인터페이스 분리 없음).
- 도메인이 커질 경우 별도 최상위 패키지로 분리한다. 패키지 중첩은 사용하지 않는다.
- 도메인 간 공유 코드(공통 예외, 유틸 등)는 `common` 패키지에 둔다.
- 비즈니스 로직은 Service 계층에서만 작성하고 Controller는 요청/응답 변환만 담당한다.
```

- [ ] **Step 2: 파일 확인**

```powershell
Get-Content templates/backend/spring-boot/architecture/no-impl/folder-structure.md
```

Expected: 위 내용이 출력됨

- [ ] **Step 3: Commit**

```bash
git add templates/backend/spring-boot/architecture/no-impl/folder-structure.md
git commit -m "feat: add spring-boot no-impl folder-structure template"
```

---

### Task 4: NestJS no-impl 템플릿 작성

**Files:**
- Create: `templates/backend/nestjs/architecture/no-impl/folder-structure.md`

- [ ] **Step 1: 파일 작성**

`templates/backend/nestjs/architecture/no-impl/folder-structure.md` 를 아래 내용으로 생성:

```markdown
# NestJS Layered Architecture — 도메인 분리형

도메인을 최상위 기준으로 삼고, 각 도메인 안에서 레이어별 서브디렉토리로 구분합니다.
서브도메인 중첩이 허용됩니다.

## 폴더 구조

​```
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
​```

## 규칙

- 최상위 디렉토리는 도메인(user / order / product …)으로 구분한다.
- 도메인 안에서 레이어별 서브디렉토리(controller / service / repository / dto / domain)로 구분한다.
- Service 계층은 구현 클래스 하나로 관리한다 (인터페이스 분리 없음).
- 서브도메인 중첩이 허용된다 (`{domain}/{sub-domain}/`). 서브도메인 안에서도 동일한 레이어 서브디렉토리 규칙을 적용한다.
- 도메인 간 공유 코드(공통 예외, 유틸 등)는 `shared` 디렉토리에 둔다.
- 비즈니스 로직은 Service 계층에서만 작성하고 Controller는 요청/응답 변환만 담당한다.
```

- [ ] **Step 2: 파일 확인**

```powershell
Get-Content templates/backend/nestjs/architecture/no-impl/folder-structure.md
```

Expected: 위 내용이 출력됨

- [ ] **Step 3: Commit**

```bash
git add templates/backend/nestjs/architecture/no-impl/folder-structure.md
git commit -m "feat: add nestjs no-impl folder-structure template"
```

---

### Task 5: prompt.ts 업데이트

**Files:**
- Modify: `cli/src/prompt.ts`

- [ ] **Step 1: `cli/src/prompt.ts` 전체를 아래 내용으로 교체**

```typescript
import inquirer from 'inquirer';

export interface Answers {
  frontend: 'react-typescript' | 'none';
  frontendRouting: 'react-router' | 'app-router';
  backend: 'spring-boot' | 'nestjs' | 'none';
  serviceImplStyle: 'impl' | 'no-impl';
}

export async function prompt(): Promise<Answers> {
  const raw = await inquirer.prompt([
    {
      type: 'list',
      name: 'frontend',
      message: '프론트엔드 스택을 선택하세요:',
      choices: [
        { name: 'React + TypeScript', value: 'react-typescript' },
        { name: '없음', value: 'none' },
      ],
    },
    {
      type: 'list',
      name: 'frontendRouting',
      message: '라우팅 방식을 선택하세요:',
      choices: [
        { name: 'react-router (Vite/SPA)', value: 'react-router' },
        { name: 'App Router (Next.js)', value: 'app-router' },
      ],
      when: (answers) => answers.frontend !== 'none',
    },
    {
      type: 'list',
      name: 'backend',
      message: '백엔드 스택을 선택하세요:',
      choices: [
        { name: 'Spring Boot', value: 'spring-boot' },
        { name: 'NestJS', value: 'nestjs' },
        { name: '없음', value: 'none' },
      ],
    },
    {
      type: 'list',
      name: 'serviceImplStyle',
      message: 'Service 계층 구현 방식을 선택하세요:',
      choices: [
        { name: 'impl 사용 (UserService 인터페이스 + UserServiceImpl)', value: 'impl' },
        { name: 'impl 사용 안 함 (UserService 클래스 하나)', value: 'no-impl' },
      ],
      when: (answers) => answers.backend === 'spring-boot',
    },
  ]);

  return {
    ...raw,
    frontendRouting: (raw.frontendRouting as string | undefined) ?? 'react-router',
    serviceImplStyle: (raw.serviceImplStyle as string | undefined) ?? 'no-impl',
  } as Answers;
}
```

- [ ] **Step 2: TypeScript 컴파일 확인**

```powershell
cd cli; npx tsc --noEmit
```

Expected: 오류 없음

- [ ] **Step 3: Commit**

```bash
git add cli/src/prompt.ts
git commit -m "feat: replace backendArchitecture/backendLayeredStyle with serviceImplStyle in prompt"
```

---

### Task 6: generate.ts 라우팅 업데이트

**Files:**
- Modify: `cli/src/generate.ts:76-103`

- [ ] **Step 1: `copyBackend` 함수 수정**

`cli/src/generate.ts` 의 `copyBackend` 함수를 아래로 교체:

```typescript
function copyBackend(
  answers: Answers,
  templateDir: string,
  docsDir: string,
  copiedFiles: string[]
): void {
  const stackSrc = path.join(templateDir, 'templates', 'backend', answers.backend);
  const dst = path.join(docsDir, 'backend');
  fse.ensureDirSync(dst);

  const implStyle = answers.backend === 'spring-boot' ? answers.serviceImplStyle : 'no-impl';
  const archPath = path.join(stackSrc, 'architecture', implStyle, 'folder-structure.md');

  if (fse.pathExistsSync(archPath)) {
    fse.copySync(archPath, path.join(dst, 'folder-structure.md'));
    copiedFiles.push('docs/backend/folder-structure.md');
  }

  for (const file of fse.readdirSync(stackSrc)) {
    const srcPath = path.join(stackSrc, file);
    if (fse.statSync(srcPath).isFile() && file.endsWith('.md')) {
      fse.copySync(srcPath, path.join(dst, file));
      copiedFiles.push(`docs/backend/${file}`);
    }
  }
}
```

- [ ] **Step 2: TypeScript 컴파일 확인**

```powershell
cd cli; npx tsc --noEmit
```

Expected: 오류 없음

- [ ] **Step 3: Commit**

```bash
git add cli/src/generate.ts
git commit -m "feat: update copyBackend routing to use serviceImplStyle"
```

---

### Task 7: 수동 동작 검증

- [ ] **Step 1: CLI 빌드**

```powershell
cd cli; npm run build
```

Expected: `cli/dist/` 에 컴파일된 파일 생성, 오류 없음

- [ ] **Step 2: Spring Boot + impl 시나리오 검증**

임시 디렉토리에서 실행:

```powershell
mkdir $env:TEMP\test-conventions-impl
cd $env:TEMP\test-conventions-impl
node <프로젝트루트>/cli/dist/index.js init
```

프롬프트 응답: frontend=없음, backend=Spring Boot, serviceImplStyle=impl 사용

Expected:
- `docs/backend/folder-structure.md` 생성됨
- 파일 내용에 `UserServiceImpl.java` 포함

```powershell
Select-String -Path docs/backend/folder-structure.md -Pattern "UserServiceImpl"
```

- [ ] **Step 3: NestJS 시나리오 검증**

```powershell
mkdir $env:TEMP\test-conventions-nestjs
cd $env:TEMP\test-conventions-nestjs
node <프로젝트루트>/cli/dist/index.js init
```

프롬프트 응답: frontend=없음, backend=NestJS (serviceImplStyle 질문이 나타나지 않아야 함)

Expected:
- `docs/backend/folder-structure.md` 생성됨
- 파일 내용에 `user.service.ts` 포함, `ServiceImpl` 없음

```powershell
Select-String -Path docs/backend/folder-structure.md -Pattern "user.service.ts"
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: verify cli routing works for all backend scenarios"
```
