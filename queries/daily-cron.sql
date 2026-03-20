create or replace function public.daily_arcade_cleanup() returns void language plpgsql security definer as $$
begin
  -- A. Clear READ notifications older than 7 days
  delete from public.notifications
  where is_read = true and created_at < now() - interval '7 days';

  -- B. Clear ALL notifications older than 30 days
  delete from public.notifications
  where created_at < now() - interval '30 days';

  -- C. Delete unverified ghost accounts older than 10 days
  delete from auth.users
  where id in (
    select auth_id from public.users
    where is_verified = false and created_at < now() - interval '10 days'
  );

  -- D. Clear system audit logs older than 15 days
  delete from public.audit_logs
  where timestamp < now() - interval '15 days';

exception when others then
  -- bubble up or log
  raise;
end;
$$;

SELECT cron.schedule(
  'daily-arcade-cleanup',
  '0 3 * * *',
  $$ SELECT public.daily_arcade_cleanup(); $$
);