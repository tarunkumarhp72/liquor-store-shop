# MH2 Wine & Spirits — Production Next.js Storefront

A modern, high-performance web application and digital cellar showcase for **MH2 Wine & Liquor Store** in NW Calgary, Alberta. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion, and Supabase PostgreSQL.

---

## 🌟 Key Features

- **Right Liquor Model:** Frictionless catalog browsing with direct 1-tap **Uber Eats delivery** and **15-minute curbside pickup** (`tel:+111*****`).
- **GotoLiquorStore Carousel:** Compact, high-impact promotional hero banners with smooth touch swipe and auto-advancing slides.
- **Auto Right-to-Left Department Carousel:** Continuous horizontal slider displaying curated cellar categories with bottle counts.
- **Cellar Catalog & Server-Side Pagination:** 16 items per page, dynamic sorting, in-stock toggles, and instant live search.
- **Glassmorphic Navigation:** Apple HIG-compliant frosted top bar, perfectly contained vector brand logo (`MH₂`), and custom favicon.
- **Mobile-First & Apple HIG Responsive:** Sticky mobile quick-action bar with safe-area insets (`env(safe-area-inset-bottom)`).
- **Staff Admin Portal:** Dedicated protected dashboard (`/admin`) for product management, stock toggle, and category management with rate-limited authentication.
- **Legal Compliance:** Mandatory 18+ Age Gate Modal, Surgeon General warnings, and Alberta liquor retail compliance notices.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS 3.4
- **Animation:** Framer Motion
- **Database:** Supabase PostgreSQL Pooler (`pg`)
- **Storage:** Supabase Storage (Public bucket: `wine-shop`)
- **Icons:** Lucide React

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/tarunkumarhp72/liquor-store-shop.git
cd liquor-store-shop
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your database URL and secrets in `.env.local`:
```env
DATABASE_URL=postgresql://postgres.[REF]:[PASSWORD]@[HOST]:5432/postgres
ADMIN_JWT_SECRET=your_super_secret_jwt_key
NEXT_PROD_STORE_NAME="MH2 Wine & Liquor Store"
NEXT_PROD_STORE_PHONE="(111) ***-***"
NEXT_PROD_STORE_ADDRESS="abc street"
NEXT_PROD_GOOGLE_MAPS_URL=""
NEXT_PROD_UBER_EATS_URL=""
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🔒 Security Best Practices

- **Zero Hardcoded Secrets:** All credentials, database connection strings, and tokens are strictly loaded via `process.env`.
- **Git Hygiene:** Real `.env` and `.env.local` files are ignored via `.gitignore` and never committed to version control.
- **Timing Attack Resistance:** PBKDF2 constant-time dummy hashing on failed authentication.
- **Rate Limiting:** Built-in IP rate limiter guarding sensitive admin endpoints (5 attempts per 5 minutes).

---

## 📄 License
Private & Proprietary — © 2026 MH2 Wine & Spirits. All rights reserved.
