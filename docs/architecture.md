# Architecture — elmanadeldia

This document describes the system architecture of elmanadeldia. It focuses on how the application is structured across frontend, backend, and storage layers, with emphasis on the **local-first model**, and future plans for **selective sync**.

---

## 🧭 Guiding Principles

- **Local-first by default**: The app is fully functional without a backend.
- **Privacy-respecting**: No data leaves the user's device unless explicitly configured.
- **Progressive enhancement**: Features like sync and sharing are optional, not mandatory.
- **Simple and robust**: Minimize moving parts and external dependencies.

---

## 🧱 System Overview

```txt
┌──────────────────────────────┐
│        Angular PWA           │
│ ┌──────────────────────────┐ │
│ │ IndexedDB (Dexie.js)     │ │ <-- Primary data source
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ Tailwind UI Components   │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ Period logic + journal   │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ Angular i18n             │ │
│ └──────────────────────────┘ │
└────────────┬─────────────────┘
             │ Optional Sync
             ▼
┌──────────────────────────────┐
│       Express API (SSR)      │
│ ┌──────────────────────────┐ │
│ │ Prisma ORM               │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ PostgreSQL               │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

---

## 🖼️ Component Layers

### 1. **Client App (Angular PWA)**

- **UI**: Built with Tailwind UI components (customized).
- **Data Layer**: IndexedDB via Dexie.js or similar abstraction.
- **Routing**: Angular Router, with SSR for public-facing routes (home, login, blog).
- **State Management**: Angular services + RxJS (no external state lib for now).
- **Offline support**: Service Worker for caching and background updates.

### 2. **Local Database**

- IndexedDB schema mirrors relational structure:
  - `budget_periods`
  - `transactions`
  - `fixed_expenses`
  - `reflections`
- IndexedDB versioning will allow data migration and schema evolution.
- All application logic reads/writes from this local DB.

### 3. **Server (Optional / Future Use)**

- **Framework**: Express (provided by Angular Uelmanadeldiarsal).
- **Purpose**:
  - Serve public pages (SSR)
  - Handle optional sync API
  - Manage user auth (planned)
- **ORM**: Prisma, targeting PostgreSQL
- **Hosting**: Self-hosted / Docker-based deployment

---

## 🔄 Planned Sync Architecture

elmanadeldia will include **optional data synchronization** for multi-device or shared budgeting.

### Sync Goals

- End-to-end encryption (E2EE) by default
- Manual or automatic sync toggle
- Conflict resolution via timestamps or merge strategies
- Device identity and version tracking

### Tentative Flow

```txt
[Local DB] <---> [Sync Adapter] <---> [Express API] --> [PostgreSQL]
      ▲                                       ▲
      │                                       └─ Authenticated via OAuth or password
      └─ Encrypt/decrypt before/after sync
```

---

## 🔐 Authentication Model (Planned)

Initial version runs entirely local and anonymous. Later phases may support:

- OAuth login (e.g., Google)
- Encrypted local user accounts
- Shared household budgets via invitation

---

## 🧪 Developer Mode / Testing

- Local mock server may simulate sync API for testing
- Possible inclusion of DevTools to inspect local DB contents

---

## 📈 Observability & Logging

For the local-first model:

- No analytics, no remote logging
- Optional client-side debug logs (persisted locally)
- Future: toggleable telemetry with opt-in only

---

## 📦 Deployment Model

- Client: Single-page PWA with SSR for static content
- Backend: Node server (Express) only needed for sync/auth/blog
- Data is stored locally unless sync is enabled

---

## 🗺️ Open Questions

| Area                    | Notes                                       |
| ----------------------- | ------------------------------------------- |
| Sync Conflict Handling  | CRDT vs. timestamp resolution?              |
| Encrypted Storage       | IndexedDB + crypto wrapper or WebCrypto?    |
| Local DB Migrations     | Dexie versioning strategy to be finalized   |
| User Identity (Offline) | Should local user have a UUID or custom ID? |

---
