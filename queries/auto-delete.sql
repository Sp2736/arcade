CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'daily-db-cleanup',         
  '0 3 * * *',                
  $$ 
    -- A. Notifications (Read): Clear read alerts older than 1 day
    DELETE FROM notifications 
    WHERE is_read = TRUE AND created_at < NOW() - INTERVAL '1 day';

    -- B. Notifications (All/Unread): Prevent bloat by clearing any older than 3 days
    DELETE FROM notifications 
    WHERE created_at < NOW() - INTERVAL '3 days';

    -- C. Rejected Resumes: Remove rejected files older than 3 days
    DELETE FROM resume_samples 
    WHERE status = 'rejected' AND created_at < NOW() - INTERVAL '3 days';

    -- D. Unverified Users: Remove ghost accounts older than 10 days
    DELETE FROM users 
    WHERE is_verified = FALSE AND created_at < NOW() - INTERVAL '10 days';
  $$
);