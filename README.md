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

### Project Structure
```
TALENTFLOW
├── dist
├── dist-seed
├── node_modules
├── public
├── src
│   ├── api
│   │   ├── msw
│   │   │   ├── browser.ts
│   │   │   └── handlers.ts
│   │   └── client.ts
│   ├── components
│   │   ├── ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── FeedbackPopup.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── select.tsx
│   │   ├── AppLayout.tsx
│   │   ├── CandidateCard.tsx
│   │   ├── CandidateForm.tsx
│   │   ├── DndCandidateCard.tsx
│   │   ├── DndJobCard.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── JobCard.tsx
│   │   ├── JobForm.tsx
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── NoteForm.tsx
│   │   └── ScrollToTop.tsx
│   ├── db
│   │   ├── dexie.ts
│   │   └── seed.ts
│   ├── hooks
│   │   ├── useAssessment.ts
│   │   ├── useCandidate.ts
│   │   ├── useCandidates.ts
│   │   ├── useJob.ts
│   │   └── useJobs.ts
│   ├── lib
│   │   └── utils.ts
│   ├── pages
│   │   ├── Assessments
│   │   │   ├── AssessmentBuilder.tsx
│   │   │   ├── AssessmentPreview.tsx
│   │   │   ├── AssessmentsPage.tsx
│   │   │   ├── OptionsBuilder.tsx
│   │   │   └── QuestionBuilder.tsx
│   │   ├── Candidates
│   │   │   ├── CandidateProfilePage.tsx
│   │   │   └── CandidatesList.tsx
│   │   └── Jobs
│   │       ├── JobDetails.tsx
│   │       └── JobsList.tsx
│   │   └── Home.tsx
│   ├── services
│   │   ├── assessmentsService.ts
│   │   ├── candidatesService.ts
│   │   └── jobsService.ts
│   ├── types
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts
```
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

## 📝 Known Issues & Workarounds

This section documents key technical challenges I encountered during development and the decisions I made to address them.

### 1. Kanban Card Position on Drop
- **Issue:** When dragging a candidate card to a new column on the Kanban board, the card correctly updated its stage but visually jumped to the end of the list on drop, instead of staying where I dropped it.  
- **Root Cause Analysis:** I traced this to a race condition between the optimistic UI update managed by `dnd-kit` and the cache invalidation from TanStack Query after the API call succeeded. Since the Candidate data model didn’t have a dedicated `order` field, the "true" order was only known by the database.  
- **Decision & Trade-off:** I decided to prioritize core functionality (successful stage change + smooth drag-and-drop UX) over perfect positional persistence. The stage assignment is always correct, even if the position resets. A future improvement would be to add an `order` field and a dedicated API call to update it.  

---

### 2. Note Modal Timing After Drag
- **Issue:** The modal for adding a note after moving a candidate between columns would sometimes fail to appear on the first attempt.  
- **Root Cause Analysis:** Rapid state changes and component re-renders triggered by the drag-end event interfered with the modal’s mounting lifecycle.  
- **Solution:** I introduced a small `setTimeout` delay (200ms) before setting the modal’s `isOpen` state. This gave the drag-and-drop animation and state updates enough time to settle, so the modal mounted reliably.  

---

### 3. Reordering a Paginated List
- **Challenge:** Implementing drag-and-drop reordering for jobs across multiple paginated pages is complex — it would mean fetching all data, managing heavy client-side state, and syncing it back with server pagination.  
- **Decision & Workaround:** Instead of over-engineering, I gave users a practical UX workaround: the "Per Page" filter lets them select a high number (e.g., 30) to show all jobs on a single view. This way, reordering works seamlessly without cross-page state management complexity.  

---

### 4. The "Unexpected token '<'" Error
- **Issue:** Occasionally the app crashed with `Unexpected token '<'... <!doctype...` when left idle in development or on deployment.  
- **Root Cause Analysis:** This happened because the fetch client was designed to strictly receive `application/json` from API endpoints. In certain cases, it instead received the full HTML document of the application. When the app tried to parse this HTML (`<!doctype html>...`) as JSON, it crashed. A similar race condition involving Vite’s Hot Module Replacement also caused the same error during development.  
- **Solution:** In `src/api/client.ts`, I made the fetch wrapper defensive. It now inspects the `Content-Type` header, and if the response is `text/html` (or anything non-JSON), it throws a controlled error (e.g., "MSW interception failed..."). This prevented crashes and let TanStack Query handle errors gracefully, so the UI now shows proper error messages instead of breaking.  

---

### 5. Synchronized Horizontal Scrollbars
- **Challenge:** On the wide Kanban board, I wanted a second scrollbar at the top, synchronized with the main one at the bottom. Browsers don’t support this natively.  
- **Solution:** I attached `useRef` hooks to both scrollable containers and added `onScroll` listeners. Whenever one scrollbar moved, I programmatically set the other’s `scrollLeft`. This gave a smooth, intuitive dual-scrollbar experience.  

---

### 6. Styling System & Specificity
- **Challenge:** While `shadcn/ui` + Tailwind CSS worked great, I hit conflicts between the library’s reset classes (like `border-0`) and my glassmorphism design, which relied on visible borders.  
- **Decision:** I manually audited the affected components and overrode or removed conflicting default classes. I chose to make sure my custom design system always took priority, keeping the UI consistent and polished.  

## 🛠️ Technical Decisions

During development, I made a few specific technical decisions that diverged from or expanded upon the original assignment requirements. These choices were made deliberately to build a more logical, user-friendly, and feature-rich application that better reflects a real-world product.

### 1. Placing the Kanban Board Under Job Details
-   **Requirement:** The assignment listed the Kanban board for moving candidates between stages under the main "Candidates" section.
-   **My Implementation:** I made the significant architectural decision to place the Kanban board on the **Job Details** page (`/jobs/:slug`).
-   **Rationale:** A hiring pipeline is fundamentally tied to a specific job opening. A candidate's stage (e.g., "Tech Interview," "Offer") only makes sense in the context of the job they applied for. Placing the Kanban board on the job details page creates a logical, intuitive user flow where the HR manager can see and manage the entire pipeline for one specific role at a time. A global Kanban board would be confusing and less practical. This was the most important structural change I made to the project's design.

### 2. Expanding "Attach Notes" to a Full Commenting System
-   **Requirement:** The assignment asked to "Attach notes with @mentions" for candidates.
-   **My Implementation:** I implemented this requirement in two key areas to create a more comprehensive communication system:
    1.  **During Stage Changes:** When moving a candidate on the Kanban board, a modal prompts the user to add an optional note explaining the stage change (e.g., "Passed the technical screen, moving to Offer").
    2.  **On the Candidate Profile:** I added a dedicated "Add a note" component directly on the candidate's profile page, allowing for general comments and discussion at any time.
-   **Rationale:** This dual implementation goes beyond a simple "attach note" feature. It creates a complete history and commenting system. The notes on stage changes provide crucial context for the candidate's timeline, while the profile-page comments allow for ongoing team collaboration. Both forms support the required `@mentions` with suggestions.

### 3. User-Friendly URLs: Slugs Instead of IDs
-   **Requirement:** The document specified deep linking to a job via `/jobs/:jobId`.
-   **My Implementation:** I chose to implement deep linking using a human-readable slug, resulting in URLs like `/jobs/senior-frontend-engineer-react`.
-   **Rationale:** While using an ID is functionally correct, using a slug is a superior, modern practice for several reasons:
    1.  **User Experience:** Slugs are more meaningful and memorable for the user.
    2.  **SEO:** They are more search-engine friendly.
    3.  **Descriptiveness:** The URL itself provides context about the page content.
    I implemented the mock API to ensure these slugs are always generated and are unique, making this a robust enhancement.

### 4. Modal-First Approach for Job Management
-   **Requirement:** The document allowed for creating/editing a job in "a modal or route."
-   **My Implementation:** I decided to use a modal for both creating and editing jobs.
-   **Rationale:** A modal provides a faster and more seamless user experience for simple CRUD (Create, Read, Update, Delete) operations. It keeps the user in the context of the jobs list they were just viewing, avoiding a disruptive full-page navigation. This makes the flow of managing multiple jobs much more efficient.

### 5. A Realistic and Interactive "File Upload Stub"
-   **Requirement:** The assessment builder needed to include a "file upload stub."
-   **My Implementation:** I interpreted "stub" to mean a component that is visually and interactively realistic, but non-functional due to the lack of a backend.
-   **Rationale:** Instead of just showing a disabled button, I built a component that mimics the standard file input experience, including a "drag and drop" zone. Crucially, when a user selects a file, the component updates its state to display the chosen file's name. This provides immediate visual feedback, making the stub *feel* functional and demonstrating how a real implementation would behave, which I believe is a better showcase of UX-focused development.

## 🚀 Future Improvements

While the current application fulfills all the core requirements, I've identified several areas for future enhancement that would elevate it to a production-grade tool.

-   **Independent Scrolling for Assessment Builder Panes:**
    Currently, the builder and preview panes scroll as a single unit. This can cause a visual misalignment where the question being edited on the left scrolls out of sync with its preview on the right. A key improvement would be to implement two independent scroll containers. This would allow the user to keep the relevant preview question in view at all times, significantly improving the usability of the builder.

-   **Enable Cross-Page Reordering:**
    The current drag-and-drop reordering for jobs is limited to the items visible on a single page. A powerful feature for managers with many job listings would be to enable cross-page reordering, allowing a user to drag a job from page 1 and drop it onto a position on page 2.

-   **Enhanced Sorting & Filtering:**
    The lists for jobs and candidates could be enhanced with more advanced sorting options (e.g., sort by creation date, sort candidates alphabetically) to give users more control over how they view their data.

-   **User Authentication & Roles:**
    Introducing a simple user authentication system would be the first step towards building a true multi-user platform. This would pave the way for features like user roles (e.g., Admin, HR Manager) and the ability to assign specific candidates or jobs to different team members.


