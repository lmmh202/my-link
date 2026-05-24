# My Link: User Scenarios

## Document Version Control

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| v1.0.0 | 2026-05-24 | AI Assistant | Initial draft outlining Visitor, Owner, and system-level scenarios. |

This document outlines the primary interaction flows for **Visitors** and **Owners** of the My Link platform, following the structure: *"In order to [goal], the user [does action]."*

---

## 1. Visitor Scenarios (방문자 시나리오)

### 1.1 Accessing the Profile Page
- **Scenario**: A visitor navigates to a creator's personalized landing page.
- **Formulation**: In order to view a creator's aggregated social media links and personal bio, the user accesses the dynamic profile URL (e.g., `/[username]`) directly or via a social media bio link.

### 1.2 Navigating to External Links
- **Scenario**: A visitor clicks on one of the creator's links.
- **Formulation**: In order to visit the creator's external platform (such as YouTube, Instagram, or a personal website), the user clicks on a link card displayed on the public page.

### 1.3 Automatic Click Tracking (System Action)
- **Scenario**: The system increments the click count behind the scenes.
- **Formulation**: In order to record accurate traffic statistics for the owner, the system increments the link's click count in the database immediately upon a visitor's click event before redirecting them to the target URL.

---

## 2. Owner Scenarios (소유자 시나리오)

### 2.1 First-Time Platform Entry & Authentication
- **Scenario**: A creator enters the home page and logs in.
- **Formulation**: 
  - In order to explore the service and begin building a link tree, the user visits the home landing page and clicks the "무료로 시작하기" (Get Started for Free) button.
  - In order to securely access their personal admin dashboard, the user performs a Google Social Authentication sign-in on the login page.
  - In order to instantly see an active profile upon registration, the system automatically generates a default user profile using the user's Google account metadata during the initial sign-in process.

### 2.2 Adding a New Link
- **Scenario**: An owner registers a new destination link.
- **Formulation**: 
  - In order to register a new destination link, the user enters a descriptive title and target URL in the "새 링크 추가" (Add New Link) form on the dashboard and clicks the "추가하기" (Add) button.
  - In order to prevent publishing broken URLs to their visitors, the system automatically validates and formats the user's inputted link before saving it to the database.

### 2.3 Modifying an Existing Link (Inline Editing)
- **Scenario**: An owner edits the details of a link.
- **Formulation**: In order to update the title or target URL of a previously added link, the user clicks the edit (pencil) icon on the specific link card, modifies the text inputs inline, and clicks the "저장" (Save) button.

### 2.4 Deleting a Link
- **Scenario**: An owner deletes an outdated link.
- **Formulation**: In order to remove an outdated or inactive link from their public profile, the user clicks the delete (trash bin) icon on the corresponding link card.

### 2.5 Profile Text & Nickname Customization (Inline Editing)
- **Scenario**: An owner updates their biography text, display name, or unique username.
- **Formulation**: 
  - In order to adjust how their identity is displayed on their public page, the user clicks the edit option next to their profile information card, modifies their display name or bio text inline, and saves the changes.
  - In order to claim a personalized URL path for their profile, the user edits their unique nickname (username) inline, triggering an automatic uniqueness verification check to ensure no other user has claimed the same handle.

---

## 3. Proposed & Future Enhancements

These scenarios describe desired behavioral flows for the next phase of development:

### 3.1 Clipboard URL Sharing
- **Scenario**: An owner wants to quickly share their link tree.
- **Formulation**: In order to share their public link tree on external social networks, the user clicks the "링크 복사" (Copy Link) button on their profile preview card to copy the dynamic URL directly to their clipboard.

### 3.2 Real-time Dashboard Analytics Monitoring
- **Scenario**: An owner wants to see click performance in real-time.
- **Formulation**: In order to analyze which external links are performing best with their audience, the user reviews the real-time click counter badge displayed on each link card inside the admin dashboard.

### 3.3 Visual Customization
- **Scenario**: An owner wants to change link styles.
- **Formulation**: In order to align the link tree aesthetics with their personal brand, the user selects a custom background theme and click highlight animation from the appearance settings panel.
