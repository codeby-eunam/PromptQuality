create extension if not exists "pgcrypto";

create type plan_type as enum ('free', 'pro', 'team');
create type traffic_signal as enum ('green', 'yellow', 'red');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan plan_type not null default 'free',
  created_at timestamptz not null default now()
);

create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  unique (team_id, user_id)
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  question_text text not null,
  context_text text,
  created_at timestamptz not null default now()
);

create table score_results (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  total_score integer not null check (total_score between 0 and 100),
  signal traffic_signal not null,
  specificity_score integer not null check (specificity_score between 0 and 100),
  context_score integer not null check (context_score between 0 and 100),
  output_format_score integer not null check (output_format_score between 0 and 100),
  summary text not null,
  raw_model_output jsonb,
  created_at timestamptz not null default now()
);

create table usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  anonymous_id text,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table share_links (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create index questions_user_id_created_at_idx on questions (user_id, created_at desc);
create index score_results_question_id_idx on score_results (question_id);
create index usage_events_user_id_created_at_idx on usage_events (user_id, created_at desc);
create index usage_events_anonymous_id_created_at_idx on usage_events (anonymous_id, created_at desc);
create index share_links_question_id_idx on share_links (question_id);
