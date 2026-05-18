# Frontend Rule Conflict Resolution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `templates/frontend/` 하위 4개 규칙 파일의 경로 불일치와 App Router 적용 범위 모호함을 최소 수정으로 해소한다.

**Architecture:** 각 파일을 독립적으로 수정한다. 파일 간 의존성 없음. 모든 변경은 기존 텍스트 일부를 교체하거나 노트를 추가하는 수준이다.

**Tech Stack:** Markdown

---

### Task 1: `typescript.md` — 도메인 타입 경로 수정

**Files:**
- Modify: `templates/frontend/typescript.md`

- [ ] **Step 1: 현재 내용 확인**

파일 18번째 줄 테이블 확인:
```
| 도메인 타입 (엔티티, 요청/응답) | `features/{domain}/types/index.ts` |
```

- [ ] **Step 2: 경로 수정**

`templates/frontend/typescript.md` 테이블 행을 수정:

변경 전:
```
| 도메인 타입 (엔티티, 요청/응답) | `features/{domain}/types/index.ts` |
```

변경 후:
```
| 도메인 타입 (엔티티, 요청/응답) | `features/{group}/{domain}/types/index.ts` |
```

- [ ] **Step 3: 커밋**

```bash
git add templates/frontend/typescript.md
git commit -m "fix: align domain type path with folder-structure group/domain convention"
```

---

### Task 2: `form-validation.md` — 예시 경로 수정

**Files:**
- Modify: `templates/frontend/form-validation.md`

- [ ] **Step 1: 현재 내용 확인**

파일 하단 예시 구조 블록 확인:
```
src/features/{domain}/
  components/
    XxxFormModal.tsx
  schemas/
    xxxSchema.ts
  types/
    index.ts
```

- [ ] **Step 2: 경로 수정**

`templates/frontend/form-validation.md` 예시 구조 블록을 수정:

변경 전:
```
src/features/{domain}/
  components/
    XxxFormModal.tsx
  schemas/
    xxxSchema.ts
  types/
    index.ts
```

변경 후:
```
src/features/{group}/{domain}/
  components/
    XxxFormModal.tsx
  schemas/
    xxxSchema.ts
  types/
    index.ts
```

- [ ] **Step 3: 커밋**

```bash
git add templates/frontend/form-validation.md
git commit -m "fix: align form-validation example path with folder-structure group/domain convention"
```

---

### Task 3: `folder-structure.md` — App Router 오버라이드 노트 추가

**Files:**
- Modify: `templates/frontend/folder-structure.md`

- [ ] **Step 1: 현재 내용 확인**

파일 21-22번째 줄 확인:
```
├── pages/                # 라우트 단위 페이지 컴포넌트
...
├── router/               # 라우터 설정 및 인증 가드
```

- [ ] **Step 2: pages/ 설명 수정**

변경 전:
```
├── pages/                # 라우트 단위 페이지 컴포넌트
```

변경 후:
```
├── pages/                # 라우트 단위 페이지 컴포넌트 (React Router 전용; App Router는 app/ 사용)
```

- [ ] **Step 3: router/ 설명 수정**

변경 전:
```
├── router/               # 라우터 설정 및 인증 가드
```

변경 후:
```
├── router/               # 라우터 설정 및 인증 가드 (React Router 전용; App Router는 파일시스템 라우팅 사용)
```

- [ ] **Step 4: 커밋**

```bash
git add templates/frontend/folder-structure.md
git commit -m "fix: annotate pages/ and router/ as React Router-only in folder-structure"
```

---

### Task 4: `state-management.md` — App Router 인증 적용 범위 명시

**Files:**
- Modify: `templates/frontend/state-management.md`

- [ ] **Step 1: 현재 내용 확인**

파일 마지막 부분 규칙 블록 및 store/ 예시 확인:
```
**규칙**
- 서버 데이터를 Zustand Store에 저장하지 않습니다. React Query가 캐싱을 담당합니다.
- Zustand Store는 클라이언트 전용 상태만 관리합니다.
- 도메인별 Store는 꼭 필요한 경우에만 만들고, 기본적으로 최소화합니다.

```
store/
├── authStore.ts    # 인증 (기존)
└── uiStore.ts      # 공통 UI 상태 (사이드바, 전역 모달 등)
```
```

- [ ] **Step 2: store/ 예시 블록 뒤에 App Router 노트 추가**

파일 끝에 다음 내용을 추가:

```markdown

> **App Router 사용 시:** 서버 인증은 middleware + cookie 기반으로 처리합니다.
> Zustand는 클라이언트 UI 상태 전용으로만 사용하며, 인증 여부 판단은 서버에서 처리합니다.
```

- [ ] **Step 3: 커밋**

```bash
git add templates/frontend/state-management.md
git commit -m "fix: clarify Zustand auth scope for App Router projects"
```
