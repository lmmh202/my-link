# Project Context: My Link

## Project Overview
**My Link** is a high-performance, responsive Linktree clone built with Next.js and Firebase. It allows users to consolidate their social media presence into a single customizable landing page, featuring real-time click tracking and a dark-themed admin dashboard.

### Core Technology Stack
- **Framework:** Next.js (App Router, TypeScript)
- **Runtime:** React 19
- **Styling:** Tailwind CSS (v4), shadcn/ui, Lucide React
- **Backend/Auth:** Firebase Auth (Google Provider), Firebase Firestore (Real-time DB)
- **Deployment:** Vercel

---

## Building and Running

### Key Commands
- **Development Server:** `pnpm dev` (Runs on `http://localhost:3000`)
- **Build Production:** `pnpm build`
- **Start Production:** `pnpm start`
- **Linting:** `pnpm lint`

### Environment Configuration
The project requires several Firebase environment variables to be configured in `.env.local`:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

Refer to `lib/firebase.ts` for how these are utilized.

---

## Architecture and Design

### Directory Structure
- `app/`: Contains the Next.js App Router routes.
    - `[username]/`: Public profile pages.
    - `admin/`: Dashboard for link and profile management.
    - `login/`: Authentication page.
- `components/ui/`: shadcn/ui component library.
- `context/`: Global React contexts (e.g., `AuthContext.tsx`).
- `lib/`: Utility functions and shared service initializations (Firebase).
- `docs/`: Product Requirements Document (PRD), Implementation Plan, and other design docs.

### Data Model (Firestore)
- **Users:** `/users/{userId}` - Profile metadata (username, display name, bio, avatar).
- **Links:** `/users/{userId}/links/{linkId}` - Subcollection for user-specific links and click metrics.

---

## Development Conventions

### Styling and UI
- Use **Tailwind CSS v4** for all styling.
- Follow the **dark-themed, glassmorphic** design language established in the project.
- Leverage **shadcn/ui** components for consistent UI elements.

### State Management
- Authentication state is managed via `AuthContext` and accessed through the `useAuth` hook.
- Database synchronization uses **Firebase Real-time Listeners** (`onSnapshot`) to ensure the UI stays updated without manual refreshes.

### Routing and Navigation
- Public pages use the dynamic route `/[username]`.
- Admin routes are protected and require authentication.

### Current Implementation Status
- **Completed:** Google Auth, Link CRUD, Public Profiles, Click Tracking, SEO.
- **In Progress:** Inline profile editing (nickname/bio updates) in `/admin/profile`.

---

## Documentation References
For detailed specifications, refer to:
- `@docs/PRD.md`: Feature list and product vision.
- `@IMPLEMENTATION_PLAN.md`: Technical roadmap and implementation phases.
- `@docs/USER_SCENARIOS.md`: Detailed user journeys.
- `@docs/WIREFRAMES.md`: UI structure and layout designs.
