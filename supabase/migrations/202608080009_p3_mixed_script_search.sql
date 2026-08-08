begin;

create or replace function public.normalize_mixed_script_search_text(value text)
returns text
language sql
immutable
parallel safe
set search_path = public, pg_temp
as $$
  select regexp_replace(
    regexp_replace(
      coalesce(value, ''),
      '([؀-ۿ])([A-Za-z0-9])',
      '\1 \2',
      'g'
    ),
    '([A-Za-z0-9])([؀-ۿ])',
    '\1 \2',
    'g'
  );
$$;

revoke all on function public.normalize_mixed_script_search_text(text) from public;
grant execute on function public.normalize_mixed_script_search_text(text) to authenticated;

drop index if exists public.sources_search_vector_idx;

alter table public.sources
  drop column search_vector;

alter table public.sources
  add column search_vector tsvector
    generated always as (
      to_tsvector(
        'simple'::regconfig,
        public.normalize_mixed_script_search_text(content)
      )
    ) stored;

create index sources_search_vector_idx
  on public.sources using gin(search_vector);

commit;
