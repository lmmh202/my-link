# My Link

**My Link** is a high-performance, fully responsive Linktree clone built with Next.js (App Router, TypeScript) and Firebase. It allows creators, influencers, and businesses to consolidate their fragmented social media presence, personal channels, and external links into a single, beautifully custom-crafted landing page.

Managed via a sleek, dark-themed glassmorphic admin dashboard, My Link features real-time Firestore database synchronization, instant public profile routing, nickname uniqueness validation, and live visitor click analytics illustrated by Recharts trend graphs.

---

## 📖 Table of Contents
1. [Key Features](#-key-features)
2. [Tech Stack](#-tech-stack)
3. [Architecture & File Structure](#-architecture--file-structure)
4. [Firestore Data Models](#-firestore-data-models)
5. [Getting Started & Configuration](#-getting-started--configuration)
6. [Available Scripts](#-available-scripts)
7. [Development Documentation](#-development-documentation)

---

## ✨ Key Features

### 🔐 1. Google Authentication & Auto-Provisioning
- **One-Tap Secure Login**: Authenticates creators using Firebase Google Social Auth.
- **Instant Profile Generation**: Automatically initializes a default user profile document (DisplayName, generic custom handle, description, and avatar photo) using Google account metadata upon first-time dashboard entry.

### 🔗 2. Real-Time Link Management (CRUD)
- **Fluid CRUD Operations**: Add, read, update, and delete destination links inside a live admin card panel.
- **Smart URL Validation**: Validates target links via the native URL API and automatically prepends `https://` if absent to guarantee valid visitor pathways.
- **Inline Editing**: Allows administrators to rename link titles and modify URLs directly inside each card without navigating to separate settings panels.

### 👤 3. In-Place Profile & Nickname Customization
- **Inline Profile Card**: Custom edit your display name and bio details with live Save/Cancel actions.
- **Unique Nickname Handle**: Claim a personalized dynamic routing path (e.g. `mylink.com/username`). Modifying handles triggers a real-time Firestore uniqueness check to prevent path duplication.
- **Static Avatar Bind**: Keeps profile images locked to the Google metadata photo in a neon glass wrap, keeping manual uploader forms clean and optimized.

### 📊 4. Recharts Clicks & Traffic Analytics Dashboard
- **Daily Trend Chart**: Displays a glowing, emerald-themed Recharts Area Chart displaying visitor traffic flow over the last 7 days.
- **Aggregate Metrics**: Summary cards displaying total clicks, registered link counters, average performance counts, and top-clicked highlight entries.
- **Performance Leaderboard**: Ranks the top 3 high-performing links in an elegant gold/silver/bronze badge deck.
- **Searchable Metrics Table**: Displays full links, click totals, and percent click shares in a searchable tabular list.

### 📱 5. Truly Live Mobile Preview
- **Integrated Viewport Frame**: Features an interactive glassmorphic smartphone mockup on the dashboard panels.
- **Real-Time Data Rendering**: Automatically pulls the creator's actual Firestore links subcollection in real time, rendering exact visual representations and navigable anchors.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router, Client-side React 19 components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4) & Custom glassmorphic CSS variables
- **UI Base**: shadcn/ui components & Lucide React icons
- **Database & Services**: Firebase Firestore & Firebase Auth (Google Provider)
- **Charts Engine**: Recharts 3.8
- **Hosting Environment**: Vercel

---

## 📂 Architecture & File Structure

```text
my-link/
├── app/                      # Next.js App Router Routes
│   ├── [username]/           # Dynamic public landing page route
│   ├── admin/                # Secure dashboard administration layouts
│   │   ├── layout.tsx        # Protected dashboard wrapper & sidebar navigation
│   │   ├── links/            # Links CRUD management subpage
│   │   ├── stats/            # Analytics charts and detailed tables subpage
│   │   └── profile/          # Profile inline text & handle settings page
│   ├── login/                # Google social login portal
│   ├── globals.css           # Styling styles & glassmorphic system overrides
│   ├── layout.tsx            # Global HTML root layout
│   └── page.tsx              # Public service landing page
├── components/               # Rescalable UI widgets
│   └── ui/                   # Custom styled shadcn/ui component kit
├── context/                  # Global context hooks
│   └── AuthContext.tsx       # Authentication session provider
├── docs/                     # Visual design and planning documents
│   ├── PRD.md                # Product Requirement Document (PRD)
│   ├── USER_SCENARIOS.md     # Visitor and Owner user workflows
│   └── WIREFRAMES.md         # ASCII wireframe layout blocks & Mermaid flowchart
├── lib/                      # Framework service helper initializations
│   └── firebase.ts           # Firebase connection configuration
├── IMPLEMENTATION_PLAN.md    # Multi-phase development roadmap
└── package.json              # Dependency declarations
```

---

## 🗃 Firestore Data Models

### Users Document (`/users/{userId}`)
```typescript
interface UserProfile {
  userId: string;          // Firestore Document ID (Firebase Auth UID)
  username: string;        // Custom dynamic routing path / nickname handle
  displayName: string;     // Creator's screen name
  bioText: string;         // Biography overview
  profileImageUrl: string; // Avatar URL fetched from Google metadata
  createdAt: Timestamp;    // Account registration date
}
```

### Links Subcollection (`/users/{userId}/links/{linkId}`)
```typescript
interface LinkItem {
  id: string;              // Link document ID
  linkTitle: string;       // Display text of the button
  targetUrl: string;       // Redirection destination
  clickCount: number;      // Visitor click metric counter
  createdAt: Timestamp;    // Timestamp for chronological sorting
}
```

---

## 🚀 Getting Started & Configuration

### Prerequisites
Make sure you have **Node.js** (v18+) and **pnpm** installed.

### 1. Repository Setup
Clone the repository and install the dependencies:
```bash
git clone https://github.com/lmmh202/my-link.git
cd my-link
pnpm install
```

### 2. Environment Configurations
Create a `.env.local` file in the root directory and configure your actual Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) inside your browser.

---

## ⌨ Available Scripts

Inside the project directory, you can run:

* `pnpm dev`: Runs the Next.js development server on `http://localhost:3000` with hot-reloads.
* `pnpm build`: Precompiles and bundles the application for production deployment.
* `pnpm start`: Runs the precompiled production bundle.
* `pnpm lint`: Lints the typescript codebase using ESLint to assure code consistency.

---

## 📝 Development Documentation

For deeper details on design visions, user journeys, and implementation plans, check out:
- [Product Requirement Document (docs/PRD.md)](file:///home/lmmh202/repositories/my-link/docs/PRD.md)
- [User Scenarios (docs/USER_SCENARIOS.md)](file:///home/lmmh202/repositories/my-link/docs/USER_SCENARIOS.md)
- [ASCII UI Wireframes & Flows (docs/WIREFRAMES.md)](file:///home/lmmh202/repositories/my-link/docs/WIREFRAMES.md)
- [Architectural Execution Roadmap (IMPLEMENTATION_PLAN.md)](file:///home/lmmh202/repositories/my-link/IMPLEMENTATION_PLAN.md)
