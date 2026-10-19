# Penang LRT Mutiara Line Community & Construction Management Portal

Responsive React + Vite + Tailwind CSS demonstration portal covering four modules:

1. **Construction announcements (public):** browse, search, category filter, view locations/dates/details.
2. **Community feedback (public):** submit a categorized report with location and description; receive a reference number; track status by reference and matching email address.
3. **Announcement management (admin demo):** create, view, edit, feature and delete announcements.
4. **Feedback management (admin demo):** review submitted reports, filter by status, change status and add public-facing update notes.

## Getting started

Requires Node.js 18+ (Node 20+ recommended).

```bash
npm install
npm run dev
```

Open the localhost address shown by Vite (typically `http://localhost:5173`).

To make a production bundle:

```bash
npm run build
npm run preview
```

`dist/` contains the static frontend build, suitable for static hosting.

## Demo walkthrough

- Use the public navigation to browse announcements and submit a report.
- After submission, save the generated `FB-...` reference.
- Use **Track feedback** with that reference and the same email address.
- Select **Admin demo** in the header to open the administrator workspace.
- Use **Announcements** to create/edit/delete notices.
- Use **Feedback inbox** to update a complaint's status and note.
- Switch back to **Public view** to view updates to announcements or tracked reports.

Sample feedback tracking credentials:
- Reference: `FB-2026-001`, email: `resident@example.com`
- Reference: `FB-2026-002`, email: `business@example.com`

## Persistence and limitations

- Announcements and feedback are persisted in `window.localStorage` under `mutiara-announcements-v1` and `mutiara-feedback-v1`.
- Sample records are loaded **only if no persisted records exist**. Clearing the site's localStorage restores the sample records.
- The public/admin role switch is **demo-only, not authentication or authorization**. There is no real login, access-control enforcement, external database, API, notifications or cross-device synchronization.
- Tracking checks an email address, but does **not** provide server-side security. Other local users with browser access or developer tools can inspect records. Do not use this solution for real personal or sensitive data.
- The sample construction notices are **fictional illustrations**, not confirmed LRT project notices. Replace them with verified official announcements before any public launch.
- For a real public deployment, implement authentication, role-based access control, a backend database, secure server-side validation and report ownership enforcement, audit logging, rate limiting and data protection controls consistent with applicable law.

## Structure

```
penang-lrt-portal/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    └── lib/
        └── data.js
```

## Modular source code structure

```text
penang-lrt-portal/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx                         # Navigation, shared state, localStorage, dialogs
    ├── index.css
    ├── lib/
    │   └── data.js                    # Sample records, categories and utilities
    ├── components/
    │   └── Common.jsx                 # Reusable cards, forms, modals and badges
    ├── pages/
    │   ├── Home.jsx                   # Public landing page
    │   └── Dashboard.jsx              # Admin overview
    └── modules/
        ├── ConstructionAnnouncements.jsx # Module 1: public announcements
        ├── CommunityFeedback.jsx         # Module 2: report submission
        ├── AnnouncementManagement.jsx    # Module 3: admin announcement list
        ├── FeedbackManagement.jsx        # Module 4: admin feedback inbox
        └── FeedbackTracking.jsx          # Public report tracking and history
```

### How the modules are connected

`App.jsx` provides the shared announcements and feedback arrays, filter values, and event callbacks as props. Components in `src/modules/` render the individual screens without duplicating the data store. Shared form/dialog components in `src/components/Common.jsx` are used by multiple screens. Changes persist under the existing localStorage keys (`mutiara-announcements-v1`, `mutiara-feedback-v1`), so previously saved demo data continues to load after the refactor.

To customize a particular module, edit its file under `src/modules/`. To change the fields in forms or the details popup, edit `src/components/Common.jsx`. For sample records or category options, edit `src/lib/data.js`.

**Build verification:** All `.jsx` files were syntax-parsed successfully. A complete `npm run build` was not possible in the preparation environment because npm dependencies could not be installed offline. Run `npm install && npm run build` on your computer to verify the full Vite build.
