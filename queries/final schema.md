---

# **FINAL DATABASE SCHEMA — ARCADE (SGP-sem-4)**

---

## **1. USER**

**Purpose:**
Acts as the **single identity anchor** for the entire system. Every human interaction maps to this table.

### Attributes

* `user_id` — **Primary Key** (system-generated, immutable)
* `full_name`
* `personal_email` — **UNIQUE**
* `college_email` — **UNIQUE**
* `password_hash`
* `role` — ENUM / encoded

  * `0` = Admin
  * `1` = Student
  * `2` = Faculty
  * `3` = HOD
* `department` — ENUM (`CS`, `CE`, `IT`)
* `college_id` — student enrollment number or employee id

  * **Nullable** (Admin may not have one)
* `status` — ENUM (`active`, `inactive`, `blocked`)
* `created_at`
* `last_login`
* `profile_completed` — BOOLEAN

### Constraints & Notes

* `user_id` is the **only identity referenced by other tables**
* `college_id` is informational, not relational
* Role-based access is derived from `role`

---

## **2. SUBJECT**

**Purpose:**
Defines **what** is taught. No teaching logistics here.

### Attributes

* `subject_id` — **Primary Key**
* `subject_name`
* `subject_code`
* `semester`
* `department` — ENUM (`CS`, `CE`, `IT`, `--` for common subjects)
* `subject_head_id` — **Foreign Key → USER.user_id**
  (must be a Faculty user)

### Constraints & Notes

* One subject has **one subject head**
* Subject existence is independent of who teaches it

---

## **3. SUBJECT_ALLOTMENT**

**Purpose:**
Models **real-world teaching assignments**, including MOOC cases.

### Attributes

* `allotment_id` — **Primary Key**
* `subject_id` — **Foreign Key → SUBJECT.subject_id**
* `teaching_mode` — ENUM (`CLASSROOM`, `MOOC`)
* `mooc_platform` — Nullable
  (NPTEL, Coursera, Udemy, etc.)
* `faculty_user_id` — **Foreign Key → USER.user_id**, Nullable
  (NULL when MOOC without classroom faculty)
* `department` — ENUM (`CS`, `CE`, `IT`, `--`)
* `section_or_class` — INTEGER

  * `0` = all classes
  * `1` = class A
  * `2` = class B
  * Nullable when department is `--`

### Constraints & Notes

* One subject → many allotments
* One faculty → many subjects
* Fully supports MOOC-based subjects
* No teaching assumptions hard-coded into SUBJECT

---

## **4. NOTES**

**Purpose:**
Stores academic notes with approval workflow.

### Attributes

* `note_id` — **Primary Key**
* `title`
* `subject_id` — **Foreign Key → SUBJECT.subject_id**
* `uploaded_by_user_id` — **Foreign Key → USER.user_id**
* `file_path`
* `status` — ENUM (`pending`, `approved`, `rejected`)
* `approved_by_user_id` — **Foreign Key → USER.user_id**, Nullable
* `visibility` — ENUM (`public`, `subject-only`)
* `created_at`

### Constraints & Notes

* Only approved notes are visible
* Rejected notes remain stored for audit and feedback
* Approval authority derived from role of approving user

---

## **5. ROADMAP**

**Purpose:**
Guided learning and career roadmaps.

### Attributes

* `roadmap_id` — **Primary Key**
* `title`
* `goal_type` — descriptive category (exam, placement, skill, etc.)
* `suggested_by_user_id` — **Foreign Key → USER.user_id**
* `steps` — JSON (predefined structure)
* `created_at`

### Constraints & Notes

* Only Faculty / HOD / Admin users can suggest roadmaps
* JSON allows flexible, visual roadmap structures
* Fully relational ownership (no free-text creators)

---

## **6. STUDENT_SKILLS**

**Purpose:**
Tracks evolving skill selections of students.

### Attributes

* `record_id` — **Primary Key**
* `student_user_id` — **Foreign Key → USER.user_id**
* `selected_skills` — JSON
* `completion_status`
* `last_updated`

### Constraints & Notes

* No forced role selection
* Skills evolve over time
* Student-centric, not job-centric

---

## **7. ROLE_REQUIREMENTS**

**Purpose:**
Knowledge base for career guidance (not enforcement).

### Attributes

* `role_id` — **Primary Key**
* `role_name`
* `mandatory_skills` — JSON
* `advanced_skills` — JSON
* `optional_skills` — JSON
* `last_updated`

### Constraints & Notes

* Informational only
* Used for comparison and guidance
* No dependency on STUDENT_SKILLS

---

## **8. RESUME_SAMPLES**

**Purpose:**
Verified resume repository for reference.

### Attributes

* `resume_id` — **Primary Key**
* `domain`
* `experience_level` — ENUM (`intern`, `fresher`, `experienced`)
* `file_path`
* `uploaded_by_user_id` — **Foreign Key → USER.user_id**
* `reference` — source link or proof document
* `verified` — BOOLEAN
* `created_at`

### Constraints & Notes

* Only Faculty / HOD / Admin can upload
* References ensure credibility
* Read-only access for students

---

## **9. RESOURCES**

**Purpose:**
Curated external learning and practice resources.

### Attributes

* `resource_id` — **Primary Key**
* `title`
* `subject_or_concept` — CP, aptitude, core topics, etc.
* `link`
* `description`
* `approved_by_user_id` — **Foreign Key → USER.user_id**

### Constraints & Notes

* Only HOD approval allowed
* Acts as quality gate for external links

---

## **10. AUDIT_LOG**

**Purpose:**
Tracks important system actions for accountability.

### Attributes

* `log_id` — **Primary Key**
* `user_id` — **Foreign Key → USER.user_id**
* `action`
* `timestamp`

### Constraints & Notes

* Optional to fully implement
* Strong justification for security, debugging, and analytics

---
