/**
 * mockDataService.ts
 * -----------------------------------------------------------------
 * Seeds the browser's sessionStorage with static demo data and
 * intercepts all outgoing fetch() calls to the backend API routes,
 * returning mock responses so the app works as a fully static demo.
 * -----------------------------------------------------------------
 */

// ─── Static Mock Users ───────────────────────────────────────────────────────

export const MOCK_USERS = {
  admin: {
    id: "mock-admin-001",
    user_id: "mock-admin-001",
    full_name: "Dr. Anjali Mehta",
    college_id: "FAC2024001",
    email: "anjali.mehta@charusat.edu.in",
    role: "admin",
    department: "Computer Engineering",
    designation: "HOD & System Administrator",
    cabin_location: "Room 401-A, CE Block",
    phone_number: "9876543210",
  },
  faculty: {
    id: "mock-faculty-001",
    user_id: "mock-faculty-001",
    full_name: "Prof. Rohan Das",
    college_id: "FAC2023044",
    email: "rohan.das@charusat.edu.in",
    role: "faculty",
    department: "Computer Science and Engineering",
    designation: "Assistant Professor",
    cabin_location: "Room 302, CSE Block",
    phone_number: "9765432109",
  },
  student: {
    id: "mock-student-001",
    user_id: "mock-student-001",
    full_name: "Swayam Patel",
    college_id: "24DCS088",
    email: "24dcs088@charusat.edu.in",
    role: "student",
    department: "Computer Engineering",
    target_role: "Full Stack Developer",
    phone_number: "9654321098",
  },
  alumni: {
    id: "mock-alumni-001",
    user_id: "mock-alumni-001",
    full_name: "Priya Sharma",
    college_id: "20DCS012",
    email: "priya.sharma@charusat.edu.in",
    role: "alumni",
    department: "Computer Science and Engineering",
    graduation_year: "2024",
    current_company: "Google India",
    current_role: "Software Engineer II",
    phone_number: "9543210987",
  },
};

// ─── Static Mock Data for API Endpoints ──────────────────────────────────────

export const MOCK_VAULT_NOTES = [
  {
    note_id: "n1",
    title: "Data Structures – Trees & Graphs Complete Notes",
    description: "In-depth explanations of AVL trees, Red-Black trees, BFS, DFS, Dijkstra, and Minimum Spanning Trees with code examples.",
    semester: "Semester 4",
    file_path: "https://drive.google.com/file/d/demo-ds-notes/view",
    view_count: 142,
    download_count: 67,
    created_at: "2026-10-28T10:00:00Z",
    users: { full_name: "Prof. Rohan Das", role: "faculty" },
    verified_by: { full_name: "Dr. Anjali Mehta" },
    subjects: { subject_name: "Data Structures", department: "Computer Engineering" },
  },
  {
    note_id: "n2",
    title: "Operating Systems – Process Scheduling & Synchronization",
    description: "Comprehensive notes covering CPU scheduling algorithms, mutexes, semaphores, and classic deadlock resolution techniques.",
    semester: "Semester 4",
    file_path: "https://drive.google.com/file/d/demo-os-notes/view",
    view_count: 98,
    download_count: 45,
    created_at: "2026-10-25T14:30:00Z",
    users: { full_name: "Swayam Patel", role: "student" },
    verified_by: { full_name: "Prof. Rohan Das" },
    subjects: { subject_name: "Operating Systems", department: "Computer Engineering" },
  },
  {
    note_id: "n3",
    title: "DBMS – SQL Joins, Normalization & B+ Trees",
    description: "Relational algebra, normal forms (1NF-BCNF), ACID properties, and indexing mechanisms explained with diagrams.",
    semester: "Semester 3",
    file_path: "https://drive.google.com/file/d/demo-dbms-notes/view",
    view_count: 210,
    download_count: 112,
    created_at: "2026-10-18T09:15:00Z",
    users: { full_name: "Rohan Das", role: "faculty" },
    verified_by: { full_name: "Dr. Anjali Mehta" },
    subjects: { subject_name: "DBMS", department: "Computer Engineering" },
  },
  {
    note_id: "n4",
    title: "Computer Networks – TCP/IP Protocol Suite & Subnetting",
    description: "Detailed packet flow, 3-way handshakes, CIDR subnetting cheatsheets, and OSI vs TCP/IP layer mappings.",
    semester: "Semester 4",
    file_path: "https://drive.google.com/file/d/demo-cn-notes/view",
    view_count: 87,
    download_count: 38,
    created_at: "2026-10-15T11:00:00Z",
    users: { full_name: "Swayam Patel", role: "student" },
    verified_by: { full_name: "Prof. Rohan Das" },
    subjects: { subject_name: "Computer Networks", department: "Computer Engineering" },
  },
];

export const MOCK_STUDENT_UPLOADS = [
  {
    note_id: "su-1",
    title: "Operating Systems – Process Scheduling & Synchronization",
    semester: "Semester 4",
    status: "approved",
    created_at: "2026-10-25T14:30:00Z",
    subjects: { subject_name: "Operating Systems" },
  },
  {
    note_id: "su-2",
    title: "Computer Networks – TCP/IP Protocol Suite & Subnetting",
    semester: "Semester 4",
    status: "approved",
    created_at: "2026-10-15T11:00:00Z",
    subjects: { subject_name: "Computer Networks" },
  },
  {
    note_id: "su-3",
    title: "Web Technologies – React 19 Server Components Deep Dive",
    semester: "Semester 4",
    status: "pending",
    created_at: "2026-11-03T16:20:00Z",
    subjects: { subject_name: "Web Technologies" },
  },
];

export const MOCK_APPROVALS = [
  {
    id: "a1",
    type: "note",
    title: "Web Technologies – React 19 Server Components Deep Dive",
    submittedBy: "Swayam Patel",
    studentId: "24DCS088",
    department: "Computer Engineering",
    submittedAt: "2026-11-03",
    status: "pending",
    link: "https://drive.google.com/demo",
  },
  {
    id: "a2",
    type: "resume",
    title: "Faculty Resume Verification – Spring 2026",
    submittedBy: "Prof. Rohan Das",
    studentId: "FAC2023044",
    department: "Computer Science and Engineering",
    submittedAt: "2026-11-02",
    status: "pending",
    link: "https://drive.google.com/demo-resume",
  },
  {
    id: "a3",
    type: "note",
    title: "Algorithms – Dynamic Programming Masterclass",
    submittedBy: "Riya Desai",
    studentId: "24DCS092",
    department: "Computer Engineering",
    submittedAt: "2026-11-01",
    status: "pending",
    link: "https://drive.google.com/demo-dp",
  },
  {
    id: "a4",
    type: "resume",
    title: "Student Internship Resume – Priya Sharma",
    submittedBy: "Priya Sharma",
    studentId: "20DCS012",
    department: "Computer Science and Engineering",
    submittedAt: "2026-10-30",
    status: "approved",
    link: "https://drive.google.com/demo-resume-2",
  },
];

export const MOCK_AUDIT_LOGS = [
  {
    id: "aud-1",
    action: "ROLE_LOGIN",
    user: "Dr. Anjali Mehta",
    role: "admin",
    ipAddress: "172.16.24.12",
    timestamp: "2026-11-04 14:10:02",
    status: "SUCCESS",
  },
  {
    id: "aud-2",
    action: "NOTE_APPROVED",
    user: "Prof. Rohan Das",
    role: "faculty",
    ipAddress: "172.16.24.89",
    timestamp: "2026-11-04 13:45:21",
    status: "SUCCESS",
  },
  {
    id: "aud-3",
    action: "NOTE_SUBMISSION",
    user: "Swayam Patel",
    role: "student",
    ipAddress: "10.0.4.15",
    timestamp: "2026-11-03 16:20:00",
    status: "PENDING_REVIEW",
  },
  {
    id: "aud-4",
    action: "SYSTEM_CONFIG_EXPORT",
    user: "System Daemon",
    role: "system",
    ipAddress: "localhost",
    timestamp: "2026-11-03 00:00:00",
    status: "SUCCESS",
  },
];

export const MOCK_ALUMNI = [
  {
    id: "al1",
    name: "Priya Sharma",
    batch: "2024",
    company: "Google India",
    role: "Software Engineer II",
    domain: "Full Stack",
    linkedin: "https://linkedin.com/in/demo-priya",
    email: "priya.sharma@charusat.edu.in",
  },
  {
    id: "al2",
    name: "Karan Joshi",
    batch: "2023",
    company: "Microsoft",
    role: "Cloud Solutions Architect",
    domain: "DevOps",
    linkedin: "https://linkedin.com/in/demo-karan",
    email: "karan.joshi@charusat.edu.in",
  },
  {
    id: "al3",
    name: "Meera Nair",
    batch: "2024",
    company: "Flipkart",
    role: "Data Scientist",
    domain: "Data Science",
    linkedin: "https://linkedin.com/in/demo-meera",
    email: "meera.nair@charusat.edu.in",
  },
  {
    id: "al4",
    name: "Aman Varma",
    batch: "2022",
    company: "Amazon Web Services",
    role: "Systems Architect",
    domain: "Cloud Computing",
    linkedin: "https://linkedin.com/in/demo-aman",
    email: "aman.varma@charusat.edu.in",
  },
];

// ─── sessionStorage Keys ──────────────────────────────────────────────────────

const SS_USER_KEY = "arcade-demo-user";
const SS_VAULT_KEY = "arcade-demo-vault";
const SS_UPLOADS_KEY = "arcade-demo-uploads";
const SS_APPROVALS_KEY = "arcade-demo-approvals";
const SS_AUDIT_KEY = "arcade-demo-audit";

// ─── Seed / Read sessionStorage ───────────────────────────────────────────────

export function seedSessionStorage(): void {
  if (typeof window === "undefined") return;

  if (!sessionStorage.getItem(SS_VAULT_KEY)) {
    sessionStorage.setItem(SS_VAULT_KEY, JSON.stringify(MOCK_VAULT_NOTES));
  }
  if (!sessionStorage.getItem(SS_UPLOADS_KEY)) {
    sessionStorage.setItem(SS_UPLOADS_KEY, JSON.stringify(MOCK_STUDENT_UPLOADS));
  }
  if (!sessionStorage.getItem(SS_APPROVALS_KEY)) {
    sessionStorage.setItem(SS_APPROVALS_KEY, JSON.stringify(MOCK_APPROVALS));
  }
  if (!sessionStorage.getItem(SS_AUDIT_KEY)) {
    sessionStorage.setItem(SS_AUDIT_KEY, JSON.stringify(MOCK_AUDIT_LOGS));
  }
}

export function getDemoUser(): any | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SS_USER_KEY) || localStorage.getItem("arcade-user");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setDemoUser(user: any): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SS_USER_KEY, JSON.stringify(user));
  localStorage.setItem("arcade-user", JSON.stringify(user));
  window.dispatchEvent(new CustomEvent("arcade-auth-change", { detail: user }));
}

export function clearDemoUser(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SS_USER_KEY);
  localStorage.removeItem("arcade-user");
  window.dispatchEvent(new CustomEvent("arcade-auth-change", { detail: null }));
}

// ─── Fetch Interceptor ────────────────────────────────────────────────────────

type MockHandler = (url: string, init?: RequestInit) => Promise<Response>;

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const mockRoutes: { pattern: RegExp; handler: MockHandler }[] = [
  // Auth – login
  {
    pattern: /\/api\/auth\/login/,
    handler: async (_url, init) => {
      const body = JSON.parse((init?.body as string) || "{}");
      const user = Object.values(MOCK_USERS).find(
        (u) => u.email.toLowerCase() === (body.email || "").toLowerCase()
      );
      if (user) {
        setDemoUser(user);
        return jsonResponse({ user });
      }
      return jsonResponse({ error: "Invalid credentials (use any demo persona button)" }, 401);
    },
  },
  // Auth – signup
  {
    pattern: /\/api\/auth\/signup/,
    handler: async () =>
      jsonResponse({ message: "Account created (demo – ephemeral session active)" }),
  },
  // Admin – approvals
  {
    pattern: /\/api\/admin\/approvals/,
    handler: async (_url, init) => {
      const approvals = JSON.parse(
        sessionStorage.getItem(SS_APPROVALS_KEY) || JSON.stringify(MOCK_APPROVALS)
      );
      if (init?.method === "POST") {
        const body = JSON.parse((init.body as string) || "{}");
        const updated = approvals.map((a: any) =>
          a.id === body.id ? { ...a, status: body.status } : a
        );
        sessionStorage.setItem(SS_APPROVALS_KEY, JSON.stringify(updated));
        return jsonResponse({ message: "Status updated successfully", approvals: updated });
      }
      return jsonResponse({ approvals });
    },
  },
  // Admin – audit
  {
    pattern: /\/api\/admin\/audit/,
    handler: async () => {
      const audit = JSON.parse(
        sessionStorage.getItem(SS_AUDIT_KEY) || JSON.stringify(MOCK_AUDIT_LOGS)
      );
      return jsonResponse({ logs: audit });
    },
  },
  // Notes
  {
    pattern: /\/api\/notes/,
    handler: async (_url, init) => {
      const vault = JSON.parse(
        sessionStorage.getItem(SS_VAULT_KEY) || JSON.stringify(MOCK_VAULT_NOTES)
      );
      const myUploads = JSON.parse(
        sessionStorage.getItem(SS_UPLOADS_KEY) || JSON.stringify(MOCK_STUDENT_UPLOADS)
      );

      if (init?.method === "POST") {
        const body = JSON.parse((init.body as string) || "{}");
        const isFaculty = body.role === "faculty" || body.role === "admin";
        const noteId = `note-${Date.now()}`;
        const newUploadItem = {
          note_id: noteId,
          title: body.title || "Untitled Resource",
          semester: body.semester || "Semester 4",
          status: isFaculty ? "approved" : "pending",
          created_at: new Date().toISOString(),
          subjects: { subject_name: body.subject_name || "General" },
        };
        const updatedUploads = [newUploadItem, ...myUploads];
        sessionStorage.setItem(SS_UPLOADS_KEY, JSON.stringify(updatedUploads));

        if (isFaculty) {
          const newVaultItem = {
            note_id: noteId,
            title: body.title,
            description: body.description || "",
            semester: body.semester,
            file_path: body.file_path || "#",
            view_count: 1,
            download_count: 0,
            created_at: new Date().toISOString(),
            users: { full_name: "Demo Faculty", role: "faculty" },
            verified_by: { full_name: "HOD Auto-Verify" },
            subjects: { subject_name: body.subject_name, department: "Computer Engineering" },
          };
          sessionStorage.setItem(SS_VAULT_KEY, JSON.stringify([newVaultItem, ...vault]));
        }

        return jsonResponse(newUploadItem);
      }

      return jsonResponse({ vault, myUploads });
    },
  },
  // Alumni
  {
    pattern: /\/api\/alumni/,
    handler: async () => jsonResponse({ alumni: MOCK_ALUMNI }),
  },
  // User
  {
    pattern: /\/api\/user/,
    handler: async () => {
      const user = getDemoUser();
      return user
        ? jsonResponse({ user })
        : jsonResponse({ error: "Not authenticated" }, 401);
    },
  },
  // Chat (AI) – stub
  {
    pattern: /\/api\/chat/,
    handler: async () =>
      jsonResponse({
        reply:
          "🤖 (Demo Mode) The AI assistant is simulated for GitHub Pages static hosting. In full deployment, this endpoint queries Google Gemini with live project context!",
      }),
  },
];

// ─── Install / Uninstall Interceptor ─────────────────────────────────────────

let _originalFetch: typeof globalThis.fetch | null = null;
let _interceptorInstalled = false;

export function installFetchInterceptor(): void {
  if (typeof window === "undefined") return;
  if (_interceptorInstalled) return;

  _originalFetch = globalThis.fetch;
  _interceptorInstalled = true;

  globalThis.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
        ? input.toString()
        : (input as Request).url;

    for (const { pattern, handler } of mockRoutes) {
      if (pattern.test(url)) {
        return handler(url, init);
      }
    }

    if (_originalFetch) {
      return _originalFetch(input, init);
    }
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  };
}

export function uninstallFetchInterceptor(): void {
  if (!_interceptorInstalled || !_originalFetch) return;
  globalThis.fetch = _originalFetch;
  _interceptorInstalled = false;
}
