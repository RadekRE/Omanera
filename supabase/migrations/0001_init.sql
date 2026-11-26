-- Konverzace, leady, spotřeba. RLS zapnuté; přístup jen přes service role ze serveru.
create extension if not exists "pgcrypto";

create table conversations (
  id uuid primary key default gen_random_uuid(),
  session_id text unique not null,
  locale text not null,
  project_slug text,
  page_context text,
  consent_chat_storage boolean not null default false,
  started_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  deleted_at timestamptz
);
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  tokens_in int, tokens_out int, model text,
  feedback smallint check (feedback in (-1,1)),
  created_at timestamptz not null default now()
);
create table leads (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete set null,
  name text not null, email text not null, phone text, message text,
  project_slug text, locale text not null, source text,
  consent_privacy boolean not null,
  consent_marketing boolean not null default false,
  consent_text_version text not null,
  consent_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','contacted','closed')),
  note text,
  notified_at timestamptz,
  created_at timestamptz not null default now(),
  constraint consent_required check (consent_privacy = true)
);
create table usage_daily (
  date date primary key, tokens_in bigint not null default 0, tokens_out bigint not null default 0, est_cost_eur numeric not null default 0
);
create table rate_limits (key text not null, window_start timestamptz not null, count int not null default 0, primary key (key, window_start));

alter table conversations enable row level security;
alter table messages enable row level security;
alter table leads enable row level security;
alter table usage_daily enable row level security;
alter table rate_limits enable row level security;
-- Žádné politiky pro anon/authenticated = bez přístupu. Server používá service role (obchází RLS).

create index on messages (conversation_id, created_at);
create index on conversations (last_message_at);
create index on leads (created_at desc);
-- Retence (spustit denně přes pg_cron / scheduled function): konverzace bez leadu 90 dní, leady 24 měsíců.
-- delete from conversations c where last_message_at < now() - interval '90 days' and not exists (select 1 from leads l where l.conversation_id = c.id);
-- delete from leads where created_at < now() - interval '24 months';
