# 🌌 Wondercraft - Server Management Form Collection Console

A state-of-the-art, production-quality **Next.js Form Collection & Administrator Dashboard** built with a custom cyber cyan dark-mode theme. Wondercraft empowers server teams to dynamically build templates, collect server parameters from clients, validate inputs server-side, and track deployment diagnostics on a high-tech visual timeline.

---

## 🎨 Theme & Tech Stack

Wondercraft is built using a cohesive, design-forward cyan dark-mode theme with the following technologies:

* **Core Framework:** Next.js 16 (App Router)
* **Language:** TypeScript (Strictly typed schemas & route responses)
* **Styling & CSS:** Tailwind CSS v4 & custom HSL cyber variables (Outfit & Space Grotesk fonts)
* **Client Animations:** Framer Motion (smooth, responsive panel sliding & modal overlays)
* **Input Validation:** Zod (dynamic runtime validators compiled from Mongo documents)
* **Persistence Layer:** MongoDB & Mongoose (cached connections for Serverless Environments)
* **Route Protection:** Edge-compatible JWT authentication via `jose` library
* **Password Hashing:** BcryptJS

---

## ⚙️ Project File Map

```
Wondercraft Website/
├── README.md                      <- Project walkthrough and setup guides
├── .env.example                   <- Configuration variables example
├── .env                           <- Local developer configuration variables
├── package.json                   <- Project scripts and dependencies
├── src/
│   ├── middleware.ts              <- Next.js Edge route protectors
│   ├── lib/
│   │   ├── db.ts                  <- Mongoose connection caching helper
│   │   └── auth.ts                <- JWT & password cryptography utilities
│   ├── models/
│   │   ├── user.ts                <- User schema models
│   │   ├── form.ts                <- Dynamic form schemas
│   │   └── submission.ts          <- Response data and ticket tracking models
│   ├── scripts/
│   │   └── seed.ts                <- Database seed script (Super Admin registration)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx         <- Glowing custom buttons
│   │   │   ├── Card.tsx           <- Blur-glass cards
│   │   │   ├── Input.tsx          <- Text / area input boxes
│   │   │   ├── Badge.tsx          <- Status badges
│   │   │   ├── Table.tsx          <- Tables
│   │   │   └── Dialog.tsx         <- State modal overlays
│   │   ├── Sidebar.tsx            <- Left side navigation panel
│   │   ├── DashboardHeader.tsx    <- Top header console title panel
│   │   └── FormFiller.tsx         <- Reusable public/private form rendering engine
│   └── app/
│       ├── page.tsx               <- Landing Page Welcome portal
│       ├── globals.css            <- CSS variables and custom cyan scrollbars
│       ├── login/
│       │   └── page.tsx           <- Security authentication login
│       ├── track-status/
│       │   └── page.tsx           <- Public ticket search timeline tracking
│       ├── forms/
│       │   └── [id]/
│       │       └── page.tsx       <- Public configuration submission form
│       └── dashboard/
│           ├── layout.tsx         <- Auth check wrapper and Sidebar layout
│           ├── page.tsx           <- Console health indicators and recent pipelines
│           ├── admins/
│           │   └── page.tsx       <- Administrator credentials CRUD panel
│           └── forms/
│               ├── page.tsx       <- Active collection templates dashboard list
│               ├── create/
│               │   └── page.tsx   <- Dynamic form drag-style designer
│               └── [id]/
│                   ├── page.tsx   <- Dashboard testing form previews
│                   └── submissions/
│                       └── page.tsx <- Configuration tickets evaluation pipeline
```

---

## 🛠️ Local Installation & Development

### 1. Get the Code & Install Dependencies
First, install all npm packages:
```bash
npm install
```

### 2. Configure Local Environment
Create a `.env` file in the root directory and add the following keys:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/server-mgmt
JWT_SECRET=super_secret_cyan_server_management_jwt_key_at_least_32_chars
```

### 3. Bootstrap the Database (Seed Super Admin)
Wondercraft requires a Super Admin to log in and manage the console. Run our seeding script to bootstrap the database:
```bash
npm run db:seed
```
This initializes the default **Super Admin**:
* **Email:** `sanpatel323@gmail.com`
* **Password:** `Codecode21@`

### 4. Run Locally
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Production Deployment (Vercel & MongoDB Atlas)

Follow these steps to deploy the application to Vercel:

### Step 1: Configure MongoDB Atlas (Database-as-a-Service)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a cluster.
2. **Configure Network Access (Crucial for Serverless Vercel):**
   * Vercel uses dynamic IPs for its Serverless Functions. You **must** whitelist incoming traffic from anywhere.
   * Go to **Network Access** -> **Add IP Address** -> Select **Allow Access From Anywhere** (`0.0.0.0/0`).
3. **Database Access:** Create a database user with read/write permissions.
4. **Get Connection String:** Go to **Database** -> Click **Connect** -> Click **Drivers** -> Copy the connection string. Replace `<db_password>` with your database user's password.

### Step 2: Seed the Remote Database
Before deploying, initialize your remote database with the Super Admin profile:
1. Temporarily replace the `MONGODB_URI` in your local `.env` file with your **MongoDB Atlas connection string**.
2. Execute the seed script:
   ```bash
   npm run db:seed
   ```
3. Once completed, you can restore your local `MONGODB_URI` back to your local instance. Your Atlas cluster now contains the Super Admin profile.

### Step 3: Deploy to Vercel
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Import the repository in the [Vercel Dashboard](https://vercel.com).
3. **Configure Environment Variables:** Add the following environment keys under **Settings -> Environment Variables**:
   * `MONGODB_URI`: *Your MongoDB Atlas connection string*
   * `JWT_SECRET`: *A secure random string (at least 32 characters)*
4. Click **Deploy**. Vercel will automatically detect the Next.js preset, build the application, and output your live production site!

---

## 🔒 Security & Architecture Details

* **Edge-Compatible Guards:** Next.js Serverless Middleware (`src/middleware.ts`) intercepts requests to `/dashboard/:path*`. It decodes the HTTP-only session cookies using the fast `jose` JWT library, verifying access in microseconds.
* **Granular Role Protection:** 
  * Only users with the `superadmin` role can access Admin Management (`/dashboard/admins`).
  * Normal `admin` accounts are restricted to building forms and processing submissions.
  * Paused accounts (`status: "paused"`) are immediately blocked and logged out.
* **Dynamic Zod Validation Engine:** Submissions to `/api/forms/[id]/submit` are parsed dynamically. The handler queries the form database, builds a custom `Zod` validation schema on-the-fly, validates all values (dates, emails, formats, checkboxes), generates a unique tracking reference token, and saves the payload.
* **Mongoose Connection Pooling:** Connection caching is implemented in `src/lib/db.ts` to ensure that Serverless Functions reuse existing MongoDB socket pools, preventing connection exhaustion and cold start delays.
