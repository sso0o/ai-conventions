# Frontend Rule Conflict Resolution Design

**Date:** 2026-05-18  
**Scope:** `templates/frontend/` 하위 규칙 파일 충돌 해소  
**Approach:** 충돌 지점 최소 수정 (Approach A)

---

## 문제 요약

`templates/frontend/` 루트의 공통 규칙 파일들이 App Router(`app-router/`)와 React Router(`react-router/`) 양쪽에 공유되도록 설계되어 있으나, 일부 규칙이 특정 프레임워크에만 유효하거나 경로 표기가 불일치함.

---

## 충돌 목록

| # | 심각도 | 파일 | 충돌 내용 |
|---|---|---|---|
| 1 | 직접 모순 | `folder-structure.md` ↔ `app-router/routing.md` | `pages/`, `router/` 폴더가 Next.js App Router에 존재하지 않음 |
| 2 | 경로 불일치 | `typescript.md:18` | `features/{domain}/types/` → `{group}` 레벨 누락 |
| 3 | 경로 불일치 | `form-validation.md:57` | `features/{domain}/` → `{group}` 레벨 누락 |
| 4 | 적용 범위 불명확 | `state-management.md` | Zustand 인증 규칙의 App Router 적용 여부 불명확 |
| 5 | 내용 없음 | `styling.md` | 보류 — 스택 미확정으로 현행 유지 |

---

## 수정 설계

### 1. `typescript.md` — 도메인 타입 경로 수정

**변경 전:**
```
features/{domain}/types/index.ts
```

**변경 후:**
```
features/{group}/{domain}/types/index.ts
```

`folder-structure.md`의 2단계 경로(`{group}/{domain}`)와 표기 통일.

---

### 2. `form-validation.md` — 예시 경로 수정

**변경 전:**
```
src/features/{domain}/
  components/
  schemas/
```

**변경 후:**
```
src/features/{group}/{domain}/
  components/
  schemas/
```

동일한 `{group}` 레벨 누락 수정.

---

### 3. `folder-structure.md` — App Router 오버라이드 노트 추가

`pages/`와 `router/` 폴더 설명에 App Router 사용 시 대체됨을 명시.

**변경 전:**
```
├── pages/                # 라우트 단위 페이지 컴포넌트
├── router/               # 라우터 설정 및 인증 가드
```

**변경 후:**
```
├── pages/                # 라우트 단위 페이지 컴포넌트 (React Router 전용; App Router는 app/ 사용)
├── router/               # 라우터 설정 및 인증 가드 (React Router 전용; App Router는 파일시스템 라우팅 사용)
```

---

### 4. `state-management.md` — App Router 인증 적용 범위 명시

Zustand 인증 규칙 하단에 App Router 사용 시 패턴 노트 추가.

**추가 내용:**
```
> **App Router 사용 시:** 서버 인증은 middleware + cookie 기반으로 처리합니다.
> Zustand는 클라이언트 UI 상태 전용으로만 사용하며, 인증 여부 판단은 서버에서 처리합니다.
```

---

## 비변경 파일

- `styling.md` — 스택 미확정으로 현행 유지
- `naming.md`, `components.md`, `comments.md` — 충돌 없음, 변경 없음
- `app-router/routing.md`, `react-router/routing.md` — 변경 없음

---

## 구조적 원칙

루트 파일은 공통 규칙을 담되, 프레임워크 의존적 내용은 해당 하위 폴더(`app-router/`, `react-router/`)에 위임한다. 루트 파일에 프레임워크별 예외가 필요한 경우 인라인 노트로 명시한다.
