begin;

create or replace function public.search_workspace_sources(
  target_workspace_id uuid,
  source_query text,
  result_limit integer default 8
)
returns table (
  source_id uuid,
  attachment_id uuid,
  file_name text,
  media_type text,
  ordinal integer,
  content text,
  page_number integer,
  start_line integer,
  end_line integer,
  rank real
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  normalized_query text;
  strict_query tsquery;
  broad_query tsquery;
  broad_query_text text;
  bounded_limit integer;
begin
  if not public.is_workspace_member(target_workspace_id) then
    raise insufficient_privilege using message = 'workspace membership required';
  end if;

  if char_length(btrim(source_query)) < 1 or char_length(source_query) > 500 then
    raise exception 'source query is outside the supported range';
  end if;

  bounded_limit := least(greatest(result_limit, 1), 20);
  normalized_query := public.normalize_mixed_script_search_text(
    btrim(source_query)
  );
  strict_query := websearch_to_tsquery('simple'::regconfig, normalized_query);

  select string_agg(quote_literal(lexeme), ' | ' order by lexeme)
  into broad_query_text
  from (
    select distinct lexeme
    from unnest(
      tsvector_to_array(to_tsvector('simple'::regconfig, normalized_query))
    ) as token(lexeme)
    where char_length(lexeme) >= 2
    order by lexeme
    limit 24
  ) bounded_lexemes;

  if broad_query_text is null or broad_query_text = '' then
    raise exception 'source query contains no searchable terms';
  end if;

  broad_query := to_tsquery('simple'::regconfig, broad_query_text);

  return query
  select
    source.id,
    source.attachment_id,
    attachment.file_name,
    attachment.media_type,
    source.ordinal,
    source.content,
    source.page_number,
    source.start_line,
    source.end_line,
    (
      case
        when source.search_vector @@ strict_query then 1.0
        else 0.0
      end
      + ts_rank_cd(source.search_vector, broad_query)
    )::real as rank
  from public.sources source
  join public.attachments attachment
    on attachment.workspace_id = source.workspace_id
    and attachment.id = source.attachment_id
  where source.workspace_id = target_workspace_id
    and attachment.status = 'ready'
    and attachment.deleted_at is null
    and source.search_vector @@ broad_query
  order by
    case
      when source.search_vector @@ strict_query then 1
      else 0
    end desc,
    ts_rank_cd(source.search_vector, broad_query) desc,
    attachment.created_at desc,
    source.ordinal asc,
    source.id asc
  limit bounded_limit;
end;
$$;

revoke all on function public.search_workspace_sources(uuid, text, integer) from public;
grant execute on function public.search_workspace_sources(uuid, text, integer) to authenticated;

commit;
