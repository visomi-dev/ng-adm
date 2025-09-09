# Tech Stack — elmanadeldia

This document describes the technologies used in elmanadeldia, including decisions for the frontend, backend, storage, styling, and tooling. The project is designed to be **local-first**, with optional backend services, and to respect user privacy by default.

---

## 🌐 Frontend

| Area                 | Technology                          | Notes                                        |
| -------------------- | ----------------------------------- | -------------------------------------------- |
| Framework            | Angular + Angular Uelmanadeldiarsal | Initialized with SSR for future public pages |
| App Model            | Progressive Web App (PWA)           | Ensures installability and offline access    |
| Styling              | Tailwind CSS                        | Utility-first CSS framework                  |
| Components           | Tailwind UI (licensed)              | Reused custom form and layout components     |
| Internationalization | Angular i18n                        | Integrated from project start                |
| Form handling        | Angular Reactive Forms              | Used with custom UI components               |
| Client storage       | IndexedDB (via Dexie or equivalent) | For structured, persistent local-first data  |

---

## 🧱 Backend

| Area           | Technology                    | Notes                                                                |
| -------------- | ----------------------------- | -------------------------------------------------------------------- |
| Runtime        | Express.js (from Angular SSR) | Used to serve SSR routes and handle API proxying                     |
| Language       | TypeScript                    | Shared across frontend and backend                                   |
| ORM / DB Layer | Prisma                        | Schema-based modeling and migrations                                 |
| Database       | PostgreSQL                    | Used only for optional sync and multi-device/cloud features (future) |

---

## 🗄️ Data Storage Strategy

elmanadeldia follows a **local-first** approach, meaning:

- **IndexedDB** is the primary client-side database, structured with a relational mindset
- Sync with the server will be optional, and treated as a secondary capability
- **Prisma + PostgreSQL** will power the sync backend when available

> SQLite was considered but is not available in the browser. IndexedDB provides a good foundation for structured, local data with the help of wrapper libraries.

---

## 🧰 Tooling and Quality

| Area              | Tool                                |
| ----------------- | ----------------------------------- |
| Linting           | ESLint                              |
| Formatting        | Prettier                            |
| Commit Standards  | Commitlint + Husky                  |
| Type Checking     | TypeScript                          |
| Translation       | Angular i18n                        |
| Code Organization | Feature-based modules               |
| CI (TBD)          | Planned (GitHub Actions or similar) |

---

## 🧪 Testing (Planned)

Testing is not yet implemented but planned as:

- **Unit Testing**: Angular TestBed + Karma
- **E2E Testing**: Playwright (preferred over Cypress)
- **Data Validation**: Zod (for client models if needed)

---

## 🔐 Auth Strategy (Planned)

Initial releases will be single-device/local-user only.

Later phases will include:

- OAuth2 (Google or similar)
- Password-based accounts
- End-to-end encryption for sync

---

## 📦 Build & Deploy

- Local build: `ng build` (for both app and SSR)
- Deployment target: Self-hosted on any Node-compatible environment
- Long-term goal: Optional Docker setup for backend/server

---

## 🚫 Excluded Technologies

| Technology          | Reason                                               |
| ------------------- | ---------------------------------------------------- |
| Firebase / Supabase | Not compatible with local-first, privacy-first model |
| Bank APIs           | Out of scope — budgeting is manual and intentional   |
| SQLite (in-browser) | Not supported in web environments                    |
| Monetization SDKs   | Not aligned with ethical goals of the project        |

---

## 🗺️ Next Steps

- Define data schema for local storage (Dexie/IndexedDB)
- Set up shared types between Angular and Prisma models
- Define versioning strategy for local DB migrations
- Evaluate sync strategies (CRDTs, timestamp conflict resolution, etc.)

---
