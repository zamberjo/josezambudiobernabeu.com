-- Reading time is no longer stored: the web derives it from each language's
-- word count at build time (readingMinutes in packages/domain), so it can
-- never go stale after an edit, and each translation gets its own.

alter table public.posts drop constraint published_post_is_complete;

drop view api.posts;
alter table public.posts drop column reading_time;

alter table public.posts add constraint published_post_is_complete check (
  status <> 'published'
  or (
    published_on is not null
    and public.html_has_text(body ->> 'es')
    and public.html_has_text(body ->> 'en')
  )
);

create view api.posts with (security_invoker = true) as
  select position, slug, status, published_on, cover, tags, title, excerpt, body
  from public.posts;

grant select on api.posts to anon, authenticated;
