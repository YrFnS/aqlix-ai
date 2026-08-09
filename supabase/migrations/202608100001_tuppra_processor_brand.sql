begin;

update public.attachment_processing_runs
set processor = 'tuppra-text'
where processor = 'kiteb-text';

commit;
