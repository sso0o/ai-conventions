# React Router 라우팅

## `src/router/` 파일 구성

라우터 관련 파일은 역할별로 분리합니다.

```
router/
├── index.tsx          # BrowserRouter 진입점
├── routes.tsx         # 전체 라우트 트리 정의
└── PrivateRoute.tsx   # 인증 가드 컴포넌트
```

**규칙**
- 라우트 추가는 반드시 `routes.tsx`에서만 합니다.
- `PrivateRoute.tsx`는 인증 가드 로직만 담고 레이아웃을 포함하지 않습니다.
- `index.tsx`는 `BrowserRouter`와 `routes.tsx`를 조합하는 역할만 합니다.

## 라우트 경로 네이밍

라우트 경로(path)는 kebab-case로 작성합니다.

```tsx
✅ { path: '/work-orders/:id', element: <WorkOrderDetailPage /> }
❌ { path: '/workOrders/:id', element: <WorkOrderDetailPage /> }
```

**규칙**
- 경로는 모두 소문자 kebab-case로 작성합니다.
- 동적 세그먼트는 `:파라미터명` 형식을 사용합니다. (예: `:id`, `:orderId`)
- 인덱스 라우트(`/`)를 제외한 모든 경로는 `/`로 시작합니다.

## 코드 스플리팅

페이지 컴포넌트는 `React.lazy`로 import하고, `routes.tsx`에서 `Suspense`로 감쌉니다.

```tsx
// src/router/routes.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));

export default function AppRoutes() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
```

**규칙**
- 모든 페이지 컴포넌트는 `React.lazy`로 import합니다.
- `Suspense`는 `routes.tsx` 최상단에 한 번만 선언합니다.
- `fallback`은 공통 로딩 컴포넌트를 사용합니다. (예: `<PageLoader />`)

## 인증 가드

`<Outlet />`을 활용해 인증 여부에 따라 리다이렉트합니다.

```tsx
// src/router/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function PrivateRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
```

```tsx
// src/router/routes.tsx — 사용 예시
<Route element={<PrivateRoute />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/work-orders" element={<WorkOrdersPage />} />
</Route>
```

**규칙**
- `PrivateRoute`는 `<Outlet />`만 렌더링하며 레이아웃을 포함하지 않습니다.
- 인증 상태는 Zustand store에서 읽습니다.
- 미인증 접근 시 `/login`으로 리다이렉트하며 `replace`를 사용해 히스토리를 남기지 않습니다.

## 네비게이션

**규칙**
- 선언적 이동은 `<Link>`를 사용합니다.
- 이벤트 핸들러 내 이동은 `useNavigate`를 사용합니다.
- 뒤로가기 대신 특정 경로로 이동해야 할 때는 `replace: true`를 사용합니다.

```tsx
// ✅ 선언적 이동
<Link to="/work-orders">작업 목록</Link>

// ✅ 이벤트 핸들러 내 이동
const navigate = useNavigate();
const handleSubmit = () => {
    await createOrder();
    navigate('/work-orders');
};

// ✅ 히스토리 대체
navigate('/login', { replace: true });

// ❌ 직접 window 조작
window.location.href = '/work-orders';
```
