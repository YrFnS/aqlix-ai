begin;

-- The service role bypasses RLS for internal validation-cache work. Public and
-- authenticated roles have no table grants, and this policy makes the intended
-- client denial explicit so the database linter does not treat the table as an
-- accidentally unfinished RLS configuration.
create policy content_validation_results_deny_clients
  on public.content_validation_results
  as restrictive
  for all
  to public
  using (false)
  with check (false);

commit;
