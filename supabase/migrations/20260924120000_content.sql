-- Content store for josezambudiobernabeu.com (ADR 0005).
--
-- Write model: tables in `public`, writable only by users listed in
-- `public.admins`. Read model: views in `api`, the only contract the web's
-- build depends on. Every translated string is a jsonb `{ "es", "en" }`
-- checked by `is_localized()`, which maps one-to-one onto the domain's
-- `Localized` type.

create extension if not exists pg_jsonschema with schema extensions;

-- ---------------------------------------------------------------------------
-- Translations
-- ---------------------------------------------------------------------------

-- Exactly the site's languages, each a string. Adding a language means
-- replacing this function and backfilling the rows (see ADR 0005).
create function public.is_localized(value jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select coalesce(
    jsonb_typeof(value) = 'object'
    and value ?& array['es', 'en']
    and (value - array['es', 'en']) = '{}'::jsonb
    and jsonb_typeof(value -> 'es') = 'string'
    and jsonb_typeof(value -> 'en') = 'string',
    false
  )
$$;

create function public.is_localized_array(value jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select jsonb_typeof(value) = 'array'
    and not exists (
      select 1 from jsonb_array_elements(value) as item where not public.is_localized(item)
    )
$$;

-- The JSON Schema of a post body: the same union as `BlockSchema` in
-- packages/domain. Adding a block kind means changing both.
create function public.post_body_schema()
returns json
language sql
immutable
set search_path = ''
as $$
  select '{
    "$defs": {
      "t": {
        "type": "object",
        "required": ["es", "en"],
        "additionalProperties": false,
        "properties": { "es": { "type": "string" }, "en": { "type": "string" } }
      },
      "text": {
        "type": "object",
        "required": ["type", "text"],
        "additionalProperties": false,
        "properties": {
          "type": { "enum": ["lede", "heading", "paragraph", "quote"] },
          "text": { "$ref": "#/$defs/t" }
        }
      },
      "list": {
        "type": "object",
        "required": ["type", "items"],
        "additionalProperties": false,
        "properties": {
          "type": { "const": "list" },
          "items": { "type": "array", "items": { "$ref": "#/$defs/t" } }
        }
      },
      "code": {
        "type": "object",
        "required": ["type", "code"],
        "additionalProperties": false,
        "properties": {
          "type": { "const": "code" },
          "code": { "type": "string" },
          "comment": { "$ref": "#/$defs/t" }
        }
      },
      "image": {
        "type": "object",
        "required": ["type", "src"],
        "additionalProperties": false,
        "properties": {
          "type": { "const": "image" },
          "src": { "type": "string", "minLength": 1 },
          "alt": { "$ref": "#/$defs/t" },
          "caption": { "$ref": "#/$defs/t" }
        }
      }
    },
    "type": "array",
    "items": {
      "oneOf": [
        { "$ref": "#/$defs/text" },
        { "$ref": "#/$defs/list" },
        { "$ref": "#/$defs/code" },
        { "$ref": "#/$defs/image" }
      ]
    }
  }'::json
$$;

-- ---------------------------------------------------------------------------
-- Shared plumbing
-- ---------------------------------------------------------------------------

create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admins is 'Users allowed to edit content. Insert a row by hand per editor.';

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()))
$$;

-- ---------------------------------------------------------------------------
-- Write model
-- ---------------------------------------------------------------------------

create type public.post_status as enum ('published', 'draft');

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status public.post_status not null default 'draft',
  published_on date,
  reading_time integer check (reading_time > 0),
  cover text,
  tags text[] not null default '{}',
  title jsonb not null check (public.is_localized(title)),
  excerpt jsonb not null check (public.is_localized(excerpt)),
  body jsonb not null default '[]'
    check (extensions.jsonb_matches_schema(public.post_body_schema(), body)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- The same rule as PostSchema: a published post is complete.
  constraint published_post_is_complete check (
    status <> 'published'
    or (published_on is not null and reading_time is not null and jsonb_array_length(body) > 0)
  )
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  name text not null unique check (name <> ''),
  featured boolean not null default false,
  project_url text not null check (project_url ~ '^https?://'),
  production_url text check (production_url ~ '^https?://'),
  technologies text[] not null default '{}',
  description jsonb not null check (public.is_localized(description)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  name text not null unique check (name <> ''),
  level integer not null check (level between 0 and 100),
  accent boolean not null default false,
  detail jsonb not null check (public.is_localized(detail)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experience (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  role text not null unique check (role <> ''),
  period jsonb not null check (public.is_localized(period)),
  summary jsonb not null check (public.is_localized(summary)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per non-list section of the page. Values are validated by the
-- domain's per-section schema on every write (backoffice) and read (build);
-- the database only guarantees each is an object.
create type public.site_section as enum (
  'meta', 'social', 'nav', 'hero', 'about', 'blog', 'education', 'quote', 'footer', 'ui'
);

create table public.site_sections (
  key public.site_section primary key,
  value jsonb not null check (jsonb_typeof(value) = 'object'),
  updated_at timestamptz not null default now()
);

create trigger touch before update on public.posts
  for each row execute function public.touch_updated_at();
create trigger touch before update on public.projects
  for each row execute function public.touch_updated_at();
create trigger touch before update on public.skills
  for each row execute function public.touch_updated_at();
create trigger touch before update on public.experience
  for each row execute function public.touch_updated_at();
create trigger touch before update on public.site_sections
  for each row execute function public.touch_updated_at();

-- Rewrites a collection's order in one statement, so a reorder is atomic.
-- Runs as the caller: RLS still decides whether the update is allowed.
create function public.reorder(collection text, ids uuid[])
returns void
language plpgsql
set search_path = ''
as $$
begin
  if collection not in ('posts', 'projects', 'skills', 'experience') then
    raise exception 'unknown collection %', collection using errcode = '22023';
  end if;
  execute format(
    'update public.%I as t set position = o.ord - 1
       from unnest($1) with ordinality as o(id, ord)
      where t.id = o.id',
    collection
  ) using ids;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.admins enable row level security;
alter table public.posts enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.experience enable row level security;
alter table public.site_sections enable row level security;

create policy "editors see themselves" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

-- Everything here ends up on a public web page, so reading is open; writing
-- is for admins only.
do $$
declare
  t text;
begin
  foreach t in array array['posts', 'projects', 'skills', 'experience', 'site_sections'] loop
    execute format(
      'create policy "content is public" on public.%I for select to anon, authenticated using (true)',
      t
    );
    execute format(
      'create policy "admins insert" on public.%I for insert to authenticated with check ((select public.is_admin()))',
      t
    );
    execute format(
      'create policy "admins update" on public.%I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))',
      t
    );
    execute format(
      'create policy "admins delete" on public.%I for delete to authenticated using ((select public.is_admin()))',
      t
    );
  end loop;
end;
$$;

revoke execute on function public.reorder(text, uuid[]) from anon;

-- ---------------------------------------------------------------------------
-- Read model: the contract the web builds from
-- ---------------------------------------------------------------------------

create schema api;
grant usage on schema api to anon, authenticated;

create view api.posts with (security_invoker = true) as
  select position, slug, status, published_on, reading_time, cover, tags, title, excerpt, body
  from public.posts;

create view api.projects with (security_invoker = true) as
  select position, name, featured, project_url, production_url, technologies, description
  from public.projects;

create view api.skills with (security_invoker = true) as
  select position, name, level, accent, detail
  from public.skills;

create view api.experience with (security_invoker = true) as
  select position, role, period, summary
  from public.experience;

create view api.site_sections with (security_invoker = true) as
  select key, value
  from public.site_sections;

grant select on all tables in schema api to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Media: covers and article images
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- A public bucket serves files by URL to anyone, but listing them is a
-- `select` on storage.objects, which needs its own policy.
create policy "admins list media" on storage.objects
  for select to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

create policy "admins upload media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));

create policy "admins replace media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

create policy "admins delete media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
