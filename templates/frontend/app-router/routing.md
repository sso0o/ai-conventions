# App Router 라우팅

## 파일 네이밍

App Router 예약 파일은 모두 소문자로 작성합니다.

| 파일 | 역할 |
|---|---|
| `page.tsx` | 라우트의 실제 UI |
| `layout.tsx` | 해당 세그먼트와 하위 세그먼트에 공유되는 레이아웃 |
| `loading.tsx` | Suspense 기반 로딩 UI |
| `error.tsx` | ErrorBoundary 기반 에러 UI |
| `not-found.tsx` | notFound() 호출 시 표시되는 UI |
| `route.ts` | API Route Handler |

## 폴더 네이밍

라우트 세그먼트 폴더는 kebab-case로 작성합니다.

```
✅ app/work-orders/[id]/page.tsx
❌ app/workOrders/[id]/page.tsx
```

## Route Groups

`(폴더명)` 형식으로 URL에 영향을 주지 않고 레이아웃을 분리합니다.

**사용 기준**
- 인증 여부에 따라 레이아웃을 나눌 때
- 같은 URL 깊이에서 레이아웃이 달라야 할 때

```
✅ 올바른 사용
app/
├── (auth)/
│   ├── layout.tsx       # 인증 페이지 전용 레이아웃
│   ├── login/page.tsx
│   └── register/page.tsx
└── (main)/
    ├── layout.tsx       # 인증 후 메인 레이아웃
    └── dashboard/page.tsx

❌ 잘못된 사용 — 레이아웃 분리 목적 없이 폴더 정리 용도로 사용
app/
└── (utils)/
    └── some-page/page.tsx
```

## Server Component vs Client Component

기본값은 Server Component입니다. 아래 조건에 해당할 때만 `'use client'`를 선언합니다.

| 조건 | Server | Client |
|---|---|---|
| 데이터 fetch (DB, API 조회) | ✅ | ❌ |
| 브라우저 이벤트 핸들러 (onClick 등) | ❌ | ✅ |
| useState, useEffect 등 React 훅 사용 | ❌ | ✅ |
| 외부 클라이언트 전용 라이브러리 | ❌ | ✅ |
| SEO가 필요한 정적 콘텐츠 | ✅ | ❌ |

**규칙**
- `'use client'` 경계는 컴포넌트 트리의 최대한 아래(leaf)에 둡니다.
- Server Component 안에 Client Component를 import할 수 있지만, 반대는 불가합니다.
- Server Component에서 Client Component로 props를 넘길 때는 직렬화 가능한 값만 전달합니다. (함수, 클래스 인스턴스 불가)

```tsx
// ✅ 'use client' 경계를 leaf에 두는 예시

// app/orders/page.tsx — Server Component
import OrderTable from './OrderTable';

export default async function OrdersPage() {
    const orders = await fetchOrders();
    return <OrderTable orders={orders} />;
}

// app/orders/OrderTable.tsx — Client Component
'use client';

export default function OrderTable({ orders }: { orders: Order[] }) {
    // 이벤트 핸들러, 훅 사용 가능
}
```

## 데이터 패칭

| 상황 | 방법 |
|---|---|
| 페이지 초기 데이터 조회 | Server Component에서 직접 `fetch` 또는 서비스 함수 호출 |
| 클라이언트에서 추가 조회 (무한스크롤, 검색 등) | Route Handler (`route.ts`) + React Query |
| 외부 API 키를 숨겨야 하는 경우 | Route Handler 경유 |

## Server Action

뮤테이션(생성, 수정, 삭제)에만 사용합니다. 조회에는 사용하지 않습니다.

```tsx
// ✅ 올바른 사용 — 뮤테이션
// app/orders/actions.ts
'use server';

export async function createOrder(formData: FormData) {
    const name = formData.get('name') as string;
    await db.order.create({ data: { name } });
    revalidatePath('/orders');
}

// ❌ 잘못된 사용 — 조회 목적 (Server Component에서 직접 fetch를 사용할 것)
'use server';

export async function getOrders() {
    return await db.order.findMany();
}
```

**규칙**
- Server Action 파일은 `actions.ts`로 네이밍합니다.
- 뮤테이션 후에는 반드시 `revalidatePath` 또는 `revalidateTag`를 호출합니다.
- Server Action에서 발생한 에러는 try/catch로 잡아 의미 있는 메시지를 반환합니다.
