# TALENTFLOW 🚀

A modern, front-end-only recruitment platform built with React and TypeScript.

**Live Demo**: [https://mdsibtain-talentflow-app.vercel.app](https://mdsibtain-talentflow-app.vercel.app)


TalentFlow is a comprehensive front-end recruitment platform that enables HR teams to manage job postings, track candidates through a hiring pipeline, and build dynamic skill assessments — all without a real backend.

> **Note:** This is a front-end only application. The "backend" is fully simulated in the browser using Mock Service Worker to intercept API requests and IndexedDB to persist data between sessions.

---

## 🎯 Core Features

### 💼 Jobs Board
- **Server-like Filtering & Pagination:** The jobs list is fully filterable by status (Active, Archived) and searchable by title or tags. All state is managed via URL parameters for shareable links.
- **Create & Edit Jobs:** Modal-driven interface for creating and editing jobs, powered by React Hook Form for robust validation (e.g., required title).
- **Unique Slug Generation:** The mock API automatically ensures all job slugs are unique, appending a number if a conflict exists.
- **Drag-and-Drop Reordering:** Job cards can be reordered with a smooth drag-and-drop interface, featuring optimistic UI updates and a simulated rollback on API failure.
- **Archive & Restore:** Jobs can be archived to hide them from the main view and later restored.
- **Deep Linking:** Each job has a unique, shareable URL (e.g., `/jobs/senior-frontend-engineer-react`).

### 👥 Candidate Management
- **High-Performance Virtualized List:** The main candidates list efficiently renders 1000+ seeded candidates using `@tanstack/react-virtual`, ensuring a smooth user experience.
- **Client & Server-Side Filtering:** Instant client-side searching by name/email and server-like filtering by hiring stage.
- **Kanban Pipeline:** A per-job, drag-and-drop Kanban board to visually manage and move candidates between stages (applied, screen, tech, etc.).
- **Detailed Candidate Profiles:** Each candidate has a profile page showing their summary, the job they applied for, and a complete timeline of their stage changes and any associated notes.
- **Notes with @mentions:** Users can add notes to a candidate's timeline. The form supports `@mentions` with suggestions and renders them with special styling.
- **Add New Candidates:** A dedicated flow allows users to add new candidates to a specific job or to the general candidate pool, with email uniqueness validation.

### 📝 Dynamic Assessments
- **Per-Job Assessment Builder:** A powerful, two-pane interface for creating custom assessments for each job.
- **Live Preview:** As questions are added and configured on the left, a fully interactive, live preview of the form is rendered on the right.
- **Rich Question Types:** Supports single-choice, multi-choice, short text, long text, numeric, and a file upload stub.
- **Robust Validation Rules:** The builder allows setting rules like required, min/max range for numbers, and maxLength for text fields. The live preview enforces these rules with real-time feedback.
- **Conditional Logic:** Questions can be configured to appear only if a previous question was answered with a specific value.
- **Local Persistence:** The state of an assessment being built is saved to `localStorage`, preventing loss of work on refresh. Finalized assessments are saved to the IndexedDB database.
- **Seeded Examples:** The application seeds three pre-built assessments for key jobs to demonstrate the full capabilities of the builder.

---

## 🛠️ Technical Stack

| Category         | Technology |
|------------------|------------|
| Framework        | React, Vite |
| Language         | TypeScript |
| Styling          | Tailwind CSS |
| Component Library| shadcn/ui, Headless UI |
| State Management | TanStack Query (React Query) for Server State; React Hooks for UI State |
| Form Management  | React Hook Form |
| Routing          | React Router |
| Drag & Drop      | dnd-kit |
| API Mocking      | Mock Service Worker (MSW) |
| Local Database   | Dexie.js (wrapper for IndexedDB) |

---

## 🏗️ Architecture & Decisions

### State Management
The application's state management is intentionally separated into distinct categories, using the best tool for each job:

- **Server State:** All asynchronous operations (fetching/updating data) are managed by TanStack Query. This provides a robust, declarative way to handle loading states, errors, caching, and mutations, keeping components clean and focused on UI.
- **Form State:** Complex forms like the Job Editor and Assessment Builder are handled by React Hook Form for high performance and simplified validation.
- **URL State:** Filters, pagination, and search queries are stored in the URL using React Router's `useSearchParams`. This makes the application's state shareable and persistent across refreshes.
- **UI State:** Simple, local component state (e.g., modal visibility) is managed with the standard `useState` hook.

### API & Data Persistence
The core of the application simulates a real-world architecture locally:

- **Mock Service Worker (MSW)** acts as the "Network Layer." It intercepts `fetch` requests at the network level, allowing the application code (services, hooks) to be written as if it were communicating with a real REST API.
- **Dexie.js (IndexedDB)** acts as the persistent "Database." MSW handlers read from and write through the IndexedDB, ensuring data persists between sessions. This architecture separates the API simulation from the data storage.
- **Artificial Latency & Failures:** All mock API endpoints include a random artificial latency (200–1200ms) and a 5–10% chance of failure on write operations to simulate real-world conditions and test optimistic UI rollbacks.

### Performance
- **Virtualization:** The candidates list uses `@tanstack/react-virtual` to ensure smooth scrolling and high performance even with thousands of items.
- **Debouncing:** Search inputs on list pages use a debounced handler to prevent excessive API calls while the user types.

---
## ⚙️ Project Setup & Installation

Clone the repository:


```
git clone https://github.com/soulassassin7/talentflow-app
cd talentflow
``` 

Install dependencies:

```
npm install
```
Run the development server:

```
npm run dev
```
The application will be available at http://localhost:5173. MSW and the IndexedDB seeding will start automatically.

Available Scripts

`npm run dev`: Starts the development server with Hot Module Replacement.

`npm run build`: Builds the application for production.






