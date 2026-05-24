# Implementation Plan: Linktree Clone Project (My Link)

This document details the phase-by-phase architectural execution plan for the My Link platform, updated to align with the final PRD, User Scenarios, and screen Wireframes.

## Document Version Control

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| v1.0.0 | 2026-05-24 | AI Assistant | Initial draft outlining the 6-phase plan in Korean. |
| v2.0.0 | 2026-05-24 | AI Assistant | Updated to English. Adjusted Phase 3 to specify inline profile/nickname custom edits, excluded manual profile image uploads, removed Firebase Storage, and recorded actual implementation statuses. |

---

## 1. Tech Stack & Infrastructure

- **Frontend Framework**: Next.js (App Router, Client-side React components)
- **Styling & Theme**: Tailwind CSS & Vanilla CSS custom variables (Neon dark-theme, glassmorphic elements)
- **UI Component Base**: shadcn/ui
- **Authentication**: Firebase Auth (Google Social Sign-In provider)
- **Database**: Firebase Firestore (Real-time snapshots)
- **Hosting Environment**: Vercel

---

## 2. Firestore Data Model Design

All properties use `lowerCamelCase` conventions.

### 2.1 `users` Collection
- **Path**: `/users/{userId}` (where `userId` represents the Firebase Auth UID)
- **Schema**:
```typescript
interface UserProfile {
  userId: string;          // Firestore Document ID (Firebase Auth UID)
  username: string;        // Unique dynamic route slug (initially email prefix)
  displayName: string;     // Public profile display name
  bioText: string;         // Creator's short description
  profileImageUrl: string; // Avatar URL fetched from Google (manual upload is excluded)
  createdAt: Timestamp;    // Account creation date
}
```

### 2.2 `links` Subcollection
- **Path**: `/users/{userId}/links/{linkId}`
- **Schema**:
```typescript
interface LinkItem {
  id: string;              // Document ID
  linkTitle: string;       // Display text of the link card button
  targetUrl: string;       // Destination URL
  clickCount: number;      // Metric counter for visitor clicks
  createdAt: Timestamp;    // Timestamp for descending order listings
}
```

---

## 3. Phase-by-Phase Execution Plan

### Phase 1: Project Environment Initialization
- **Objective**: Establish the directory skeletal layout, install visual style systems, and set up Firebase SDK configurations.
- **Status**: **Completed**
- **Branch**: `feature/init-project`
- **Actions**:
  - Configure Next.js and Tailwind CSS environment.
  - Setup shadcn/ui design configurations and base components.
  - Setup Firebase configuration files and initialize client connection objects.

### Phase 2: User Authentication (Google Auth)
- **Objective**: Integrate Google Sign-In and global authentication contexts.
- **Status**: **Completed**
- **Branch**: `feature/auth-google`
- **Actions**:
  - Implement `AuthContext` and custom `useAuth` hooks for managing reactive state.
  - Design a responsive dark-theme glassmorphic `/login` route.
  - Configure navigation route guards forcing unauthenticated sessions to `/login`.

### Phase 3: Admin Dashboard - Profile Inline Customization
- **Objective**: Replace the profile settings placeholder card with real-time inline text editors.
- **Status**: **In Progress** (Placeholder UI active)
- **Branch**: `feature/admin-profile`
- **Technical Requirements**:
  - **Inline Form Editing**: Replace standard form inputs inside `/admin/profile` with inline double-click or click-to-edit elements, featuring Save and Cancel controls updating Firestore dynamically.
  - **Nickname Uniqueness Check**: Integrate query verification checking if the modified `username` is already claimed by another user document before committing updates.
  - **Storage Exclusions**: Eliminate active image file upload forms. Retain Google Auth photo URLs as static avatars.

### Phase 4: Admin Dashboard - Links CRUD
- **Objective**: Build link management interfaces mapping to the subcollection models in real time.
- **Status**: **Completed**
- **Branch**: `feature/admin-links`
- **Actions**:
  - Integrate a real-time Firestore database listener (`onSnapshot`) to render the current list dynamically.
  - Code target URL parser validating and prepending `https://` protocols to inputs.
  - Implement dynamic link creation forms, delete triggers, and inline card update inputs.

### Phase 5: Dynamic Public Profile & Click Tracking
- **Objective**: Open Dynamic Route pages rendering creator cards and tracking performance.
- **Status**: **Completed**
- **Branch**: `feature/public-page-and-stats`
- **Actions**:
  - Build dynamic route `/[username]` resolving database queries against `username` field.
  - Implement static centering container grids optimized for mobile device screen layouts.
  - Build visitor interaction triggers firing non-blocking `increment(1)` click updates in Firestore upon card selections.

### Phase 6: SEO Configuration & Deployment Pipeline
- **Objective**: Apply metadata settings and connect GitHub repos to Vercel build systems.
- **Status**: **Completed**
- **Branch**: `feature/seo-and-deploy`
- **Actions**:
  - Write generic dynamically resolved Open Graph tags for platform previews (e.g., KakaoTalk, Instagram).
  - Add structural SEO fields inside metadata indexes.
  - Deploy final configurations to Vercel production hosting.
