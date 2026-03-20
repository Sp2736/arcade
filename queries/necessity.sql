-- 1. Link your public.users table strictly to Supabase Auth
ALTER TABLE public.users 
  ADD CONSTRAINT users_auth_id_fkey 
  FOREIGN KEY (auth_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Update existing foreign keys to include ON DELETE CASCADE
-- First, drop the old constraints
ALTER TABLE public.notes DROP CONSTRAINT IF EXISTS notes_uploaded_by_fkey;
ALTER TABLE public.notes DROP CONSTRAINT IF EXISTS notes_verified_by_fkey;
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE public.resume_samples DROP CONSTRAINT IF EXISTS resume_samples_uploaded_by_fkey;
ALTER TABLE public.student_progress DROP CONSTRAINT IF EXISTS student_progress_student_id_fkey;
ALTER TABLE public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;
ALTER TABLE public.faculty_teaching_load DROP CONSTRAINT IF EXISTS faculty_teaching_load_faculty_id_fkey;

-- Now, add them back with cascading logic
ALTER TABLE public.notes ADD CONSTRAINT notes_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(user_id) ON DELETE CASCADE;
-- (verified_by should NOT cascade, if a faculty leaves, we just set the verifier to NULL, we don't delete the note)
ALTER TABLE public.notes ADD CONSTRAINT notes_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(user_id) ON DELETE SET NULL;

ALTER TABLE public.notifications ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
ALTER TABLE public.resume_samples ADD CONSTRAINT resume_samples_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(user_id) ON DELETE CASCADE;
ALTER TABLE public.student_progress ADD CONSTRAINT student_progress_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
ALTER TABLE public.audit_logs ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
ALTER TABLE public.faculty_teaching_load ADD CONSTRAINT faculty_teaching_load_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.users(user_id) ON DELETE CASCADE;