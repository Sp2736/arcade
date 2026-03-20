-- 1. Create the automation function
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.last_updated = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Attach the trigger to the student progress table
CREATE TRIGGER update_student_progress_modtime
BEFORE UPDATE ON public.student_progress
FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();