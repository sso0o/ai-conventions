# Frontend Architecture 단순화 설계

## 배경

프론트엔드 아키텍처 선택지로 Layered Architecture와 Feature-Slice Design 두 가지를 제공하고 있었으나, Layered Architecture는 내용이 비어 있고 Feature-Slice와 실질적인 차별점이 없다. 선택지를 제거하고 Feature-Slice 단일 구조로 통합한다.

## 변경 사항

### 1. 템플릿 파일 이동

- `templates/frontend/architecture/feature-slice/folder-structure.md` → `templates/frontend/folder-structure.md`
- `templates/frontend/architecture/` 디렉토리 전체 삭제

`generate.ts`의 공통 파일 루프(`templates/frontend/*.md`)가 이미 존재하므로, 이동 후 별도 로직 추가 없이 자동으로 복사된다.

### 2. CLI — `cli/src/prompt.ts`

- `Answers` 타입에서 `frontendArchitecture` 필드 제거
- `frontendArchitecture` 질문 항목 제거
- fallback 기본값(`?? 'layered'`) 제거

### 3. CLI — `cli/src/generate.ts`

- `copyFrontend()` 내 아키텍처 분기 블록 삭제
  ```ts
  // 삭제 대상
  const archPath = path.join(frontendSrc, 'architecture', answers.frontendArchitecture, 'folder-structure.md');
  const fallbackPath = path.join(frontendSrc, 'architecture', 'layered', 'folder-structure.md');
  const resolvedArch = fse.pathExistsSync(archPath) ? archPath : fallbackPath;
  if (fse.pathExistsSync(resolvedArch)) { ... }
  ```

### 4. README.md

- 지원 스택 표에서 `Layered Architecture` 프론트엔드 행 제거
- 템플릿 구조 다이어그램에서 `architecture/` 하위 항목 제거, `folder-structure.md`를 `frontend/` 직하로 표기

## 영향 범위

- 백엔드 아키텍처 선택(Layered / Clean)은 변경 없음
- 기존 Feature-Slice 내용(`folder-structure.md`) 변경 없음
