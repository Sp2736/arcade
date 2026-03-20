-- 1. Enable RLS on all sensitive tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- 2. Subjects Policy: Anyone logged in can read the syllabus/subjects
CREATE POLICY "Subjects are viewable by everyone" ON public.subjects FOR SELECT USING (auth.role() = 'authenticated');

-- 3. Users Policy: Users manage their own profile; Faculty/Admin can view all profiles
CREATE POLICY "Users view own profile" ON public.users FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE USING (auth.uid() = auth_id);
CREATE POLICY "Faculty/Admin view all users" ON public.users FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE auth_id = auth.uid() AND role IN ('faculty', 'admin'))
);

-- 4. Notes Policy: 
-- Anyone can view approved notes
CREATE POLICY "View approved notes" ON public.notes FOR SELECT USING (status = 'approved');
-- Uploaders can view/manage their own pending/rejected notes
CREATE POLICY "Uploaders manage own notes" ON public.notes FOR ALL USING (
    uploaded_by IN (SELECT user_id FROM public.users WHERE auth_id = auth.uid())
);
-- Faculty/Admin can manage all notes
CREATE POLICY "Faculty manage all notes" ON public.notes FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE auth_id = auth.uid() AND role IN ('faculty', 'admin'))
);

-- 5. Progress & Notifications: Strict isolation (Users ONLY see their own)
CREATE POLICY "Users manage own notifications" ON public.notifications FOR ALL USING (
    user_id IN (SELECT user_id FROM public.users WHERE auth_id = auth.uid())
);
CREATE POLICY "Students manage own progress" ON public.student_progress FOR ALL USING (
    student_id IN (SELECT user_id FROM public.users WHERE auth_id = auth.uid())
);

-- 6. Resumes: Read-only for students, writable for Admins/Faculty
CREATE POLICY "Read Approved Resumes" ON public.resume_samples FOR SELECT USING (status = 'approved');
CREATE POLICY "Admins manage resumes" ON public.resume_samples FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE auth_id = auth.uid() AND role IN ('faculty', 'admin'))
);