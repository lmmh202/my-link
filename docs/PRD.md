# Product Requirement Document (PRD): My Link

## 1. Project Overview

### 1.1 Project Name
**My Link**

### 1.2 Purpose & Vision
My Link is a high-performance, responsive Linktree clone that allows users to consolidate their fragmented social media presence, personal web pages, and external links into a single, customizable landing page. The goal is to provide a central digital hub for sharing, coupled with real-time visitor statistics tracking, and managed via an intuitive, dark-themed admin dashboard.

### 1.3 Target Audience
- **Individual Content Creators**: YouTubers, streamers, bloggers, and artists who need to direct their followers to multiple content platforms.
- **Social Media Influencers**: Instagram, TikTok, and Twitter/X personalities seeking to maximize a single "link in bio" slot.
- **Freelancers & Professionals**: Designers, developers, and writers showcasing portfolios, resumes, and booking services.
- **Small Businesses**: Brands looking to aggregate shopping links, customer service contact portals, and ongoing promotions.

---

## 2. Product Requirements & Features List

Features are categorized by their implementation priority: **Essential (Must-Have)** features representing the core minimum viable product (MVP), and **Optional (Should-Have/Nice-to-Have)** features planned for future phases.

### 2.1 Essential (Must-Have) Features

| ID | Feature Name | Description | Status |
| :--- | :--- | :--- | :--- |
| **F-01** | Google Authentication | Users can log in using Google Social Auth. New accounts are automatically created. | **Implemented** |
| **F-02** | Automatic Profile Provisioning | Generates a default username, profile picture, name, and bio using Google metadata upon initial admin dashboard access. | **Implemented** |
| **F-03** | Real-Time Link Management (CRUD) | Add, read, update, and delete web links from the admin page with real-time database synchronization. | **Implemented** |
| **F-04** | Target URL Validation & Formatting | Validates input URLs and prepends `https://` if missing. | **Implemented** |
| **F-05** | Public Profile Page | A public route (`/[username]`) showing the user's links, bio, and avatar. | **Implemented** |
| **F-06** | Real-Time Click Count Tracking | Increments a link click counter on public click events and displays live statistics in the admin dashboard. | **Implemented** |
| **F-07** | Custom Profile Settings | Allows users to manually edit display name, biography text, profile image, and custom username. | **In Progress** (Placeholder UI) |
| **F-08** | Dark Mode Responsive UI | Mobile-first dashboard and public pages using Tailwind CSS and shadcn/ui. | **Implemented** |

### 2.2 Optional (Future Enhancements)

| ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **F-09** | Drag-and-Drop Link Reordering | Allow users to visually drag and reorder link cards to adjust the sequence on the public page. | High (Should-Have) |
| **F-10** | Interactive Live Mobile Preview | A live rendering of the public page on the admin dashboard that updates in real time. | Medium (Should-Have) |
| **F-11** | Visual Link Customization | Custom background themes, animated click highlights, and brand-specific icons. | Medium (Nice-to-Have) |
| **F-12** | Advanced Analytics & Reports | Historical charts showing clicks over days/weeks/months rather than just a total count. | Medium (Should-Have) |
| **F-13** | Custom SEO Meta Settings | Let users set their own page title, description, and preview image for search engines. | Low (Nice-to-Have) |

---

## 3. Detailed Feature Specifications

### 3.1 Authentication & Profile Provisioning (F-01, F-02)
- **Sign-In Flow**: Users click "Google로 계속하기" on the `/login` page. The system redirects to Google Sign-In via Firebase Auth.
- **Account Creation**: 
  - If the user database document does not exist under `users/{uid}`, it is created.
  - Default fields are derived as follows:
    - `username`: Email prefix (e.g., `user` from `user@gmail.com`). Fallback to `uid`.
    - `displayName`: Google account display name. Fallback to `"사용자"`.
    - `bioText`: `"저의 채널을 방문해주셔서 감사합니다! 🚀"`.
    - `profileImageUrl`: Google photo URL. Fallback to an empty string.
- **Redirection**: On successful authentication, users are redirected to `/admin`.

### 3.2 Real-Time Link Management (F-03, F-04)
- **Form Fields**: Requires Link Title and Target URL.
- **Validation Rules**:
  - Title: Must not be empty.
  - URL: Must not be empty. Auto-prepends `https://` if it does not begin with `http://` or `https://`. Evaluated using native `URL` parser.
- **Operations**:
  - **Create**: Inserts doc under `users/{uid}/links` with `clickCount: 0` and `createdAt: serverTimestamp()`.
  - **Read**: Live snapshot sync (`onSnapshot`) ordered by `createdAt` descending.
  - **Update**: Edit title or URL inline in the card with real-time save or cancel actions.
  - **Delete**: Remove link document from database after confirmation.

### 3.3 Public Profile Page (F-05, F-06)
- **Routing**: Accessed via dynamic path `/[username]`.
- **User Lookup Strategy**:
  1. Search for matching `username` field in `users` collection.
  2. Fallback: Search directly by document ID (matching `userId`).
- **Render**: Displays profile image, display name, bio, and lists active link buttons.
- **Click Tracking**:
  - Clicking a link increments the corresponding `clickCount` field by `1` in Firestore using `increment(1)` operation.
  - The operation is asynchronous and non-blocking to ensure fast navigation.

### 3.4 Profile Customization (F-07)
- **Current Status**: Accessible via `/admin/profile`. Standard mockup card active.
- **Requirements**:
  - Text inputs for Display Name and Bio.
  - Image file uploader connecting to Firebase Storage. Updates `profileImageUrl` after upload completes.
  - Username uniqueness check before allowing modification to prevent duplicate URL routes.

---

## 4. Technical Architecture & Data Schema

### 4.1 System Stack
- **Framework**: Next.js (App Router, Client-side React components).
- **Styling**: Tailwind CSS & Vanilla CSS (variables, glassmorphic styles).
- **UI Base**: shadcn/ui.
- **Backend & Auth**: Firebase Auth (Google Provider).
- **Database**: Firebase Firestore.
- **Storage**: Firebase Storage (for profile images).

### 4.2 Firestore Data Schema

#### `users` Collection
- Path: `/users/{userId}`
```typescript
interface UserProfile {
  userId: string;          // String: Firestore Document ID (Firebase Auth UID)
  username: string;        // String: Unique URL handle / slug
  displayName: string;     // String: Public-facing name
  bioText: string;         // String: Description under avatar
  profileImageUrl: string; // String: URL path to Firebase Storage or external avatar
  createdAt: Timestamp;    // Timestamp: Document creation date
}
```

#### `links` Subcollection
- Path: `/users/{userId}/links/{linkId}`
```typescript
interface LinkItem {
  id: string;              // String: Document ID
  linkTitle: string;       // String: Display label on link button
  targetUrl: string;       // String: Complete destination URL
  clickCount: number;      // Number: Click metrics accumulator
  createdAt: Timestamp;    // Timestamp: For ordering list entries
}
```

---

## 5. Non-Functional Requirements

- **Performance**: Public profiles must load in under 1 second. Utilizes client-side real-time listeners for updates while fetching user metadata statically where possible.
- **Responsive Layout**: Seamless presentation across viewport widths:
  - Mobile: Under `640px` (optimized for in-app browser engines like KakaoTalk, Instagram).
  - Tablet/Desktop: Dashboard is side-by-side; public views remain centered and constrained to a standard mobile width (`max-w-md`) to preserve the native social links aesthetic.
- **Security**: Data mutation in Firestore is limited to verified owner accounts through Firestore Security Rules.
  - Public can read `users` and `links` subcollections.
  - Write permissions are restricted to `request.auth.uid == userId`.

---

## 6. Project Planning

### 6.1 Future Documentation Plans
To keep the PRD concise and focused on high-level functionality, adjacent plans are scheduled for separate files:
1. **User Scenarios (`docs/USER_SCENARIOS.md`)**: Complete walkthroughs of creator, visitor, and administrator journeys.
2. **Wireframes (`docs/WIREFRAMES.md`)**: Structure and layouts for dashboard views and custom template previews.
