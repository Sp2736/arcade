-- 1. Enable the pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Schedule the daily cleanup job to run at 3:00 AM (UTC)
SELECT cron.schedule(
  'daily-db-cleanup',         -- Unique name for the job
  '0 3 * * *',                -- Cron schedule: 3:00 AM every day
  $$ 
    -- A. Audit Logs: Clear records older than 10 days
    DELETE FROM audit_logs 
    WHERE timestamp < NOW() - INTERVAL '10 days';

    -- B. Notifications (Read): Clear read alerts older than 1 day
    DELETE FROM notifications 
    WHERE is_read = TRUE AND created_at < NOW() - INTERVAL '1 day';

    -- C. Notifications (All/Unread): Prevent bloat by clearing any older than 3 days
    DELETE FROM notifications 
    WHERE created_at < NOW() - INTERVAL '3 days';

    -- D. Rejected Resumes: Remove rejected files older than 3 days
    DELETE FROM resume_samples 
    WHERE status = 'rejected' AND created_at < NOW() - INTERVAL '3 days';

    -- E. Unverified Users: Remove ghost accounts older than 10 days
    -- (Ensure you have added the 'is_verified' column to your users table first)
    DELETE FROM users 
    WHERE is_verified = FALSE AND created_at < NOW() - INTERVAL '10 days';
  $$
);