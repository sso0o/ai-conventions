# 폴더 구조

**기능 기준(Feature-first)** 구조를 사용합니다.

```
src/
├── features/             # 도메인별 기능 모음
│   ├── {group-a}/        # 기능 그룹 (예: master, prod-basic)
│   │   ├── {domain-1}/
│   │   └── {domain-2}/
│   └── {group-b}/
│       └── {domain-1}/
├── common/
│   ├── components/       # 공통 UI 컴포넌트 (Button, Modal, Table 등)
│   ├── hooks/            # 공통 훅
│   ├── utils/            # 공통 유틸 함수 (날짜 포맷, 숫자 포맷 등)
│   └── constants/        # 전역 공통 상수
├── pages/                # 라우트 단위 페이지 컴포넌트 (React Router 전용; App Router는 app/ 사용)
├── store/                # Zustand 전역 상태
├── lib/                  # axios, supabase 등 외부 라이브러리 설정
├── router/               # 라우터 설정 및 인증 가드 (React Router 전용; App Router는 파일시스템 라우팅 사용)
└── types/                # 전역 공통 타입 정의
```

각 feature 내부 구조:

```
features/{group}/{domain}/
├── api/          # axios 호출 순수 함수
├── components/   # 도메인 전용 컴포넌트
├── constants/    # 도메인 전용 상수 (as const 값)
├── hooks/        # React Query 훅
├── schemas/      # 폼 유효성 검증 스키마
├── types/        # 타입 정의 (index.ts)
└── index.ts      # public API — 외부에 공개할 항목만 re-export
```

pages 내부 구조:

```
pages/
├── {group-a}/
│   ├── {Domain1}Page.tsx
│   └── {Domain2}Page.tsx
└── {group-b}/
    └── {Domain1}Page.tsx
```

**규칙**
- 새 기능은 반드시 `features/{group}/{domain}/` 안에 위치시킵니다.
- 라우트 단위 페이지 컴포넌트는 `pages/`에 위치시킵니다.
- `pages/` 내부는 `features/`와 동일한 group 구조로 구성합니다.
- 페이지 컴포넌트는 레이아웃과 feature 컴포넌트를 조합하는 역할만 합니다.
- 두 도메인 이상에서 사용하는 컴포넌트/훅은 `common/`으로 분리합니다.
- `lib/`에는 외부 라이브러리 초기화·설정 코드만 둡니다.
- 폼 유효성 검증 스키마는 해당 feature 내부의 `schemas/`에 둡니다.
    - 예: `src/features/{group}/{domain}/schemas/{domain}Schema.ts`
- 도메인 전용 상수는 해당 feature 내부의 `constants/`에 둡니다.
    - 예: `src/features/{group}/{domain}/constants/{domain}Status.ts`
- feature 내부를 직접 import하지 않습니다. 반드시 `index.ts`를 통해 접근합니다.
    ```ts
    // ✅
    import { useDomain } from '@/features/{group}/{domain}'
    // ❌
    import { useDomain } from '@/features/{group}/{domain}/hooks/useDomain'
    ```
