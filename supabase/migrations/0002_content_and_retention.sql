-- Obsah spravovaný v adminu. Bez Supabase web čte soubory z content/ (záloha).
create table projects (
  slug text primary key,
  status text not null default 'draft' check (status in ('draft','published')),
  data jsonb not null,           -- celý objekt projektu (schéma ProjectSchema)
  updated_at timestamptz not null default now()
);
create table blog_posts (
  slug text not null,
  locale text not null check (locale in ('cs','de','en','pl')),
  status text not null default 'draft' check (status in ('draft','published')),
  title text not null, excerpt text not null default '', body text not null default '',
  date date not null default current_date,
  updated_at timestamptz not null default now(),
  primary key (slug, locale)
);
alter table projects enable row level security;
alter table blog_posts enable row level security;
-- Bez politik = bez přístupu přes anon klíč; server používá service role.

-- Retence: spouštět denně (Supabase Scheduled Function / pg_cron: select purge_old_data();)
create or replace function purge_old_data() returns void language sql as $$
  delete from conversations c where c.last_message_at < now() - interval '90 days'
    and not exists (select 1 from leads l where l.conversation_id = c.id);
  delete from leads where created_at < now() - interval '24 months';
  delete from rate_limits where window_start < now() - interval '1 day';
$$;
