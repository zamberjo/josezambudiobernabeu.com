-- Post bodies become HTML, one document per language: `{ "es": "<p>…</p>", "en": "…" }`.
--
-- They are written in the backoffice's WYSIWYG editor and sanitised at build
-- time by the web's ArticleRenderer, so the database only guarantees the
-- shape: a localized object, like every other translated field. Existing
-- block-based bodies are converted in place, so no post is lost.

create function pg_temp.esc(value text)
returns text
language sql
immutable
as $$
  select replace(replace(replace(replace(coalesce(value, ''), '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;')
$$;

-- One language of a block body, as HTML. Mirrors what BlogReader rendered.
create function pg_temp.blocks_to_html(body jsonb, lang text)
returns text
language sql
immutable
as $$
  select coalesce(string_agg(
    case block ->> 'type'
      when 'lede' then '<p>' || pg_temp.esc(block -> 'text' ->> lang) || '</p>'
      when 'heading' then '<h2>' || pg_temp.esc(block -> 'text' ->> lang) || '</h2>'
      when 'paragraph' then '<p>' || pg_temp.esc(block -> 'text' ->> lang) || '</p>'
      when 'quote' then '<blockquote><p>' || pg_temp.esc(block -> 'text' ->> lang) || '</p></blockquote>'
      when 'list' then '<ul>' || (
        select coalesce(string_agg('<li>' || pg_temp.esc(item ->> lang) || '</li>', '' order by n), '')
        from jsonb_array_elements(block -> 'items') with ordinality as items(item, n)
      ) || '</ul>'
      when 'code' then '<pre><code>' || pg_temp.esc(block ->> 'code') || '</code></pre>'
        || case when block ? 'comment' then '<p><em>' || pg_temp.esc(block -> 'comment' ->> lang) || '</em></p>' else '' end
      when 'image' then '<figure><img src="' || pg_temp.esc(block ->> 'src') || '" alt="'
        || pg_temp.esc(block -> 'alt' ->> lang) || '">'
        || case when block ? 'caption' then '<figcaption>' || pg_temp.esc(block -> 'caption' ->> lang) || '</figcaption>' else '' end
        || '</figure>'
      else ''
    end, '' order by n), '')
  from jsonb_array_elements(body) with ordinality as blocks(block, n)
$$;

alter table public.posts drop constraint published_post_is_complete;
alter table public.posts drop constraint posts_body_check;
alter table public.posts alter column body drop default;

update public.posts
set body = jsonb_build_object(
  'es', pg_temp.blocks_to_html(body, 'es'),
  'en', pg_temp.blocks_to_html(body, 'en')
)
where jsonb_typeof(body) = 'array';

-- Whether an HTML fragment has anything to read; the same test as `hasText`
-- in packages/domain. Media counts as content, empty paragraphs do not.
create function public.html_has_text(html text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select btrim(regexp_replace(
    regexp_replace(coalesce(html, ''), '<(img|iframe|video|pre)\M', 'x<', 'gi'),
    '<[^>]*>|&nbsp;', '', 'g'
  )) <> ''
$$;

alter table public.posts
  alter column body set default '{"es": "", "en": ""}'::jsonb,
  add constraint posts_body_check check (public.is_localized(body)),
  add constraint published_post_is_complete check (
    status <> 'published'
    or (
      published_on is not null
      and reading_time is not null
      and public.html_has_text(body ->> 'es')
      and public.html_has_text(body ->> 'en')
    )
  );

drop function public.post_body_schema();
