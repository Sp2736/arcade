-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.audit_logs (
  log_id integer NOT NULL DEFAULT nextval('audit_logs_log_id_seq'::regclass),
  user_id integer,
  action character varying NOT NULL,
  details jsonb,
  ip_address character varying,
  timestamp timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT audit_logs_pkey PRIMARY KEY (log_id),
  CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
CREATE TABLE public.faculty_teaching_load (
  load_id integer NOT NULL DEFAULT nextval('faculty_teaching_load_load_id_seq'::regclass),
  faculty_id integer,
  subject_id integer,
  is_theory boolean DEFAULT false,
  is_practical boolean DEFAULT false,
  CONSTRAINT faculty_teaching_load_pkey PRIMARY KEY (load_id),
  CONSTRAINT faculty_teaching_load_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.users(user_id),
  CONSTRAINT faculty_teaching_load_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(subject_id)
);
CREATE TABLE public.notes (
  note_id integer NOT NULL DEFAULT nextval('notes_note_id_seq'::regclass),
  title character varying NOT NULL,
  description text,
  subject_id integer,
  semester character varying,
  file_path character varying NOT NULL,
  uploaded_by integer,
  verified_by integer,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying]::text[])),
  rejection_reason text,
  download_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT notes_pkey PRIMARY KEY (note_id),
  CONSTRAINT notes_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(subject_id),
  CONSTRAINT notes_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(user_id),
  CONSTRAINT notes_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(user_id)
);
CREATE TABLE public.notifications (
  notification_id integer NOT NULL DEFAULT nextval('notifications_notification_id_seq'::regclass),
  user_id integer,
  title character varying NOT NULL,
  message text NOT NULL,
  type character varying DEFAULT 'info'::character varying CHECK (type::text = ANY (ARRAY['info'::character varying, 'success'::character varying, 'warning'::character varying, 'error'::character varying]::text[])),
  is_read boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT notifications_pkey PRIMARY KEY (notification_id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
CREATE TABLE public.resume_samples (
  resume_id integer NOT NULL DEFAULT nextval('resume_samples_resume_id_seq'::regclass),
  title character varying NOT NULL,
  domain character varying NOT NULL,
  experience_level character varying CHECK (experience_level::text = ANY (ARRAY['intern'::character varying, 'fresher'::character varying, 'experienced'::character varying, 'advanced'::character varying]::text[])),
  file_path character varying NOT NULL,
  uploaded_by integer,
  status character varying DEFAULT 'pending_hod'::character varying CHECK (status::text = ANY (ARRAY['pending_hod'::character varying, 'approved'::character varying, 'rejected'::character varying]::text[])),
  rejection_reason text,
  download_count integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT resume_samples_pkey PRIMARY KEY (resume_id),
  CONSTRAINT resume_samples_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(user_id)
);
CREATE TABLE public.student_progress (
  progress_id integer NOT NULL DEFAULT nextval('student_progress_progress_id_seq'::regclass),
  student_id integer,
  target_role character varying,
  completed_nodes jsonb DEFAULT '[]'::jsonb,
  last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT student_progress_pkey PRIMARY KEY (progress_id),
  CONSTRAINT student_progress_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(user_id)
);
CREATE TABLE public.subjects (
  subject_id integer NOT NULL DEFAULT nextval('subjects_subject_id_seq'::regclass),
  subject_name character varying NOT NULL,
  subject_code character varying UNIQUE,
  semester character varying NOT NULL,
  department character varying NOT NULL,
  CONSTRAINT subjects_pkey PRIMARY KEY (subject_id)
);
CREATE TABLE public.users (
  user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'::regclass),
  full_name character varying NOT NULL,
  college_email character varying NOT NULL UNIQUE,
  personal_email character varying UNIQUE,
  password_hash character varying NOT NULL,
  college_id character varying NOT NULL UNIQUE,
  role character varying NOT NULL CHECK (role::text = ANY (ARRAY['student'::character varying, 'faculty'::character varying, 'admin'::character varying]::text[])),
  department character varying NOT NULL,
  bio text,
  phone_number character varying,
  profile_picture character varying,
  target_role character varying,
  designation character varying,
  cabin_location character varying,
  is_hod boolean DEFAULT false,
  last_login timestamp without time zone,
  last_profile_update timestamp without time zone,
  last_role_update timestamp without time zone,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  auth_id uuid UNIQUE,
  is_verified boolean DEFAULT false,
  CONSTRAINT users_pkey PRIMARY KEY (user_id)
);