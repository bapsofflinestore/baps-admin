# BAPS Admin Panel

Super Admin Dashboard for BAPS Offline Rewards Platform.

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run development server
```bash
npm run dev
```

### 3. Open in browser
```
http://localhost:3000
```

You will be automatically redirected to the login page.

---

## 🔑 Demo Login Credentials

| Field    | Value             |
|----------|-------------------|
| Email    | admin@baps.com    |
| Password | admin123          |

Or click the **"Fill demo credentials"** button on the login screen.

---

## 📁 Project Structure

```
src/
  app/
    page.tsx                  ← Redirects to /login
    layout.tsx                ← Root layout
    globals.css               ← Global styles
    login/
      page.tsx                ← Login page
    admin/
      layout.tsx              ← Sidebar + Topbar (shared across all admin pages)
      dashboard/
        page.tsx              ← Main dashboard
```

---

## 📦 Key Dependencies

- **Next.js 14** — App Router
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility styling
- **Recharts** — Charts (area, bar, pie)

---

## 🛠️ Next Pages to Build

| Page                     | Route                      |
|--------------------------|----------------------------|
| Withdrawal Requests      | /admin/withdrawals         |
| KYC Approvals            | /admin/kyc                 |
| Bill Verification        | /admin/bills               |
| Fraud Flags              | /admin/fraud               |
| Shop Management          | /admin/shops               |
| User Management          | /admin/users               |
| Analytics                | /admin/analytics           |
| Settings                 | /admin/settings            |

---

Built by Voltoro.Studio for BAPS Offline Rewards — 2026
