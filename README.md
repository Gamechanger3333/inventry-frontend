# Nexus Inventory — Next.js 15 Frontend

Converted from Vite + Wouter to **Next.js 15 App Router**.

## Setup

```bash
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL to your Express backend URL
npm run dev
```

## What changed from the Vite version

| Old (Vite)                        | New (Next.js 15)                        |
|-----------------------------------|-----------------------------------------|
| `wouter` for routing              | Next.js App Router (`app/` directory)   |
| `<Router>` + `<Switch>` in App.tsx | File-system routing with `page.tsx`    |
| `useLocation()` / `setLocation()` | `useRouter()` / `router.push()`         |
| `<Link href>` from wouter         | `<Link href>` from `next/link`          |
| `@workspace/api-client-react`     | `lib/api-hooks.ts` (direct fetch)       |
| `vite.config.ts`                  | `next.config.ts`                        |
| `src/index.css` (Tailwind v4)     | `app/globals.css` (Tailwind v3)         |

## Route Structure

```
app/
├── layout.tsx              # Root layout (Providers)
├── page.tsx                # Landing page (/)
├── not-found.tsx           # 404
├── globals.css
├── (public)/
│   ├── login/page.tsx      # /login
│   └── signup/page.tsx     # /signup
└── (protected)/
    ├── layout.tsx          # Auth guard + AppLayout
    ├── dashboard/page.tsx
    ├── products/page.tsx
    ├── categories/page.tsx
    ├── inventory/page.tsx
    ├── warehouses/page.tsx
    ├── sales/page.tsx
    ├── purchases/page.tsx
    ├── customers/page.tsx
    ├── suppliers/page.tsx
    ├── invoices/page.tsx
    ├── notifications/page.tsx
    ├── reports/page.tsx
    └── ai/page.tsx
```

## Environment Variables

| Variable               | Description                  | Default                    |
|------------------------|------------------------------|----------------------------|
| `NEXT_PUBLIC_API_URL`  | Your Express backend URL     | `http://localhost:3000`    |
