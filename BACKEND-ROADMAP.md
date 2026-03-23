# 🚀 ARCADE Master Integration Roadmap

## Phase 1: Authentication & Identity (The Foundation)
*Goal: Ensure secure login and global access to user data across the app.*
- [x] **Database:** Implement the normalized PostgreSQL schema (users, subjects, notes, etc.).
- [x] **Backend:** Update `/api/auth/signup` to insert full profiles into `public.users`.
- [x] **Backend:** Update `/api/auth/login` to fetch profile, update `last_login`, and return `user_id`.
- [x] **Frontend:** Ensure `MainLayout.tsx` securely holds the session state.
- [x] **Frontend:** Pass the dynamic `user` object from `MainLayout.tsx` down to `StudentDashboard.tsx` and `FacultyDashboard.tsx`.
- [x] **Frontend:** Map `user.full_name`, `user.college_id`, and `user.department` to dashboard headers/sidebars.

## Phase 2: System Catalogs & Dynamic Dropdowns
*Goal: Replace hardcoded arrays (like Subjects) with real database values.*
- [x] **Backend:** Create `/api/subjects` (GET) to fetch subjects filtered by department/semester.
- [x] **Frontend:** Update `NotesView.tsx` to fetch subjects from the API instead of using the static `SUBJECTS_LIST`.

## Phase 3: The Resource Vault (Notes & Study Materials)
*Goal: Allow students to upload pending notes, and faculty to approve and publish them.*
- [x] **Backend:** Create `/api/notes` (GET) to fetch approved notes and user's personal uploads.
- [x] **Backend:** Create `/api/notes` (POST) to insert new notes (`status: pending` for students, `approved` for faculty).
- [x] **Frontend:** Connect `NotesView.tsx` (Student) upload form and browse grid.
- [x] **Backend:** Create `/api/admin/notes` (GET) to fetch all notes where `status = 'pending'`.
- [x] **Backend:** Create `/api/admin/notes` (PUT) to update status to `approved` or `rejected`.
- [x] **Frontend:** Connect `FacultyVerification.tsx` to fetch pending notes and build the Approve/Reject UI buttons.
- [x] **Frontend:** Connect `FacultyUploads.tsx` so HODs can directly upload auto-approved materials.

## Phase 4: Expert Network & Resume Verification
*Goal: Manage the submission and approval of student resumes.*
- [x] **Backend:** Create `/api/resumes` (GET) to fetch all `approved` resumes.
- [x] **Backend:** Create `/api/resumes` (POST) to insert new resumes (`status: pending_hod`).
- [x] **Frontend:** Update the Resume/Expert Network UI (Student) to upload Drive links for resumes.
- [x] **Backend:** Create `/api/admin/resumes` (GET/PUT) for the Faculty to fetch pending resumes and approve/reject them.
- [x] **Frontend:** Add a "Resumes" tab inside `FacultyVerification.tsx` to handle these approvals.

## Phase 5: Student Profile & Roadmap Progress
*Goal: Save the student's target role and track their skill progression.*
- [ ] **Backend:** Create `/api/profile` (GET/PUT) to update the `users` table (`bio`, `phone_number`, `target_role`).
- [ ] **Backend:** Create `/api/progress` (GET/POST) to read/write the `completed_nodes` JSON array in the `student_progress` table.
- [ ] **Frontend:** Wire up `StudentProfile.tsx` to load and save bio/role changes.
- [ ] **Frontend:** Wire up the Roadmap Nodes (checkboxes/skills) to fire a PUT request to `/api/progress` when a student checks off a skill.

## Phase 6: Admin Audit & Analytics (The Command Center)
*Goal: Give the HOD visibility over system actions.*
- [ ] **Backend:** Inject Audit Logic. Update the `PUT` routes (Approving notes/resumes) to also `INSERT INTO audit_logs` (e.g., "Prof. Patel approved Note #45").
- [ ] **Backend:** Create `/api/admin/audit` (GET) to fetch the latest logs.
- [ ] **Frontend:** Build an `AuditLogs.tsx` view inside the Faculty Dashboard to display this timeline.