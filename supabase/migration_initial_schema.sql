-- ─────────────────────────────────────────────────────────────
-- GestorOps — Schema inicial v1.0
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────

-- ── CLIENTS ──────────────────────────────────────────────────
create table public.clients (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  company     text,
  sector      text,
  type        text not null default 'active' check (type in ('active','inactive','prospect')),
  email       text,
  phone       text,
  website     text,
  notes       text,
  tags        text[] default '{}',
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── PROJECTS ─────────────────────────────────────────────────
create table public.projects (
  id                  uuid primary key default gen_random_uuid(),
  client_id           uuid not null references public.clients(id) on delete cascade,
  title               text not null,
  description         text,
  tech_stack          jsonb default '[]',
  status              text not null default 'active' check (status in ('proposal','active','paused','completed','cancelled')),
  priority            text not null default 'medium' check (priority in ('critical','high','medium','low')),
  start_date          date,
  estimated_end_date  date,
  actual_end_date     date,
  budget              numeric(10,2),
  notes               text,
  tags                text[] default '{}',
  created_by          uuid references auth.users(id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ── MAINTENANCES ─────────────────────────────────────────────
create table public.maintenances (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references public.clients(id) on delete cascade,
  name            text not null,
  description     text,
  type            text not null default 'monthly',
  price           numeric(10,2),
  billing_period  text not null default 'monthly' check (billing_period in ('monthly','quarterly','yearly')),
  status          text not null default 'active' check (status in ('active','paused','cancelled')),
  start_date      date,
  created_by      uuid references auth.users(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── MAINTENANCE ENTRIES ───────────────────────────────────────
create table public.maintenance_entries (
  id              uuid primary key default gen_random_uuid(),
  maintenance_id  uuid not null references public.maintenances(id) on delete cascade,
  period          text not null,
  status          text not null default 'pending' check (status in ('pending','in_progress','completed','invoiced')),
  work_done       text,
  hours_spent     numeric(5,2),
  completed_at    timestamptz,
  completed_by    uuid references auth.users(id) on delete set null,
  created_at      timestamptz not null default now()
);

-- ── INCIDENTS ────────────────────────────────────────────────
create table public.incidents (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references public.clients(id) on delete cascade,
  project_id        uuid references public.projects(id) on delete set null,
  title             text not null,
  description       text,
  priority          text not null default 'medium' check (priority in ('critical','high','medium','low')),
  status            text not null default 'open' check (status in ('open','in_progress','waiting_client','resolved','closed')),
  resolution_notes  text,
  hours_spent       numeric(5,2),
  assigned_to       uuid references auth.users(id) on delete set null,
  opened_at         timestamptz not null default now(),
  closed_at         timestamptz,
  created_by        uuid references auth.users(id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ── TECHNICAL ACCESSES ───────────────────────────────────────
create table public.technical_accesses (
  id                  uuid primary key default gen_random_uuid(),
  client_id           uuid not null references public.clients(id) on delete cascade,
  type                text not null check (type in ('hosting','database','platform','api','domain','email','ssh','custom')),
  name                text not null,
  url                 text,
  username_encrypted  text,
  password_encrypted  text,
  notes_encrypted     text,
  last_verified_at    timestamptz,
  status              text not null default 'active' check (status in ('active','expired','unknown')),
  created_by          uuid references auth.users(id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ── ACCESS LOG (append-only) ──────────────────────────────────
create table public.access_log (
  id            uuid primary key default gen_random_uuid(),
  access_id     uuid not null references public.technical_accesses(id) on delete cascade,
  action        text not null check (action in ('viewed','copied','edited','created')),
  performed_by  uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now()
);

-- ── RENEWALS ─────────────────────────────────────────────────
create table public.renewals (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references public.clients(id) on delete cascade,
  name          text not null,
  type          text not null check (type in ('domain','hosting','ssl','license','contract','custom')),
  provider      text,
  renewal_date  date not null,
  cost          numeric(10,2),
  status        text not null default 'active' check (status in ('active','expired','cancelled')),
  notify_days   int[] default '{30,15,7}',
  notes         text,
  created_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── INFRASTRUCTURE ITEMS ─────────────────────────────────────
create table public.infrastructure_items (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references public.clients(id) on delete cascade,
  category    text not null check (category in ('server','database','cdn','platform','email','monitoring','storage','custom')),
  name        text not null,
  provider    text,
  url         text,
  description text,
  status      text not null default 'active' check (status in ('active','inactive','unknown')),
  metadata    jsonb default '{}',
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── DOCUMENTS ────────────────────────────────────────────────
create table public.documents (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid references public.clients(id) on delete cascade,
  project_id  uuid references public.projects(id) on delete set null,
  title       text not null,
  content     text default '',
  type        text not null default 'note' check (type in ('note','manual','procedure','meeting','decision','custom')),
  tags        text[] default '{}',
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── TASKS ────────────────────────────────────────────────────
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid references public.clients(id) on delete cascade,
  project_id  uuid references public.projects(id) on delete set null,
  title       text not null,
  description text,
  status      text not null default 'todo' check (status in ('todo','in_progress','done','cancelled')),
  priority    text not null default 'medium' check (priority in ('critical','high','medium','low')),
  due_date    date,
  assigned_to uuid references auth.users(id) on delete set null,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── ACTIVITY LOG (append-only) ────────────────────────────────
create table public.activity_log (
  id            uuid primary key default gen_random_uuid(),
  entity_type   text not null,
  entity_id     uuid,
  action        text not null,
  description   text,
  metadata      jsonb default '{}',
  performed_by  uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- ÍNDICES
-- ─────────────────────────────────────────────────────────────
create index on public.projects (client_id);
create index on public.projects (status);
create index on public.maintenances (client_id);
create index on public.maintenance_entries (maintenance_id, period);
create index on public.incidents (client_id);
create index on public.incidents (status);
create index on public.incidents (priority);
create index on public.technical_accesses (client_id);
create index on public.renewals (client_id);
create index on public.renewals (renewal_date);
create index on public.renewals (status);
create index on public.tasks (client_id);
create index on public.tasks (status);
create index on public.activity_log (entity_type, entity_id);
create index on public.activity_log (created_at desc);

-- ─────────────────────────────────────────────────────────────
-- UPDATED_AT AUTO-UPDATE
-- ─────────────────────────────────────────────────────────────
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_clients_updated_at
  before update on public.clients for each row execute function public.update_updated_at();
create trigger trg_projects_updated_at
  before update on public.projects for each row execute function public.update_updated_at();
create trigger trg_maintenances_updated_at
  before update on public.maintenances for each row execute function public.update_updated_at();
create trigger trg_incidents_updated_at
  before update on public.incidents for each row execute function public.update_updated_at();
create trigger trg_technical_accesses_updated_at
  before update on public.technical_accesses for each row execute function public.update_updated_at();
create trigger trg_renewals_updated_at
  before update on public.renewals for each row execute function public.update_updated_at();
create trigger trg_infrastructure_items_updated_at
  before update on public.infrastructure_items for each row execute function public.update_updated_at();
create trigger trg_documents_updated_at
  before update on public.documents for each row execute function public.update_updated_at();
create trigger trg_tasks_updated_at
  before update on public.tasks for each row execute function public.update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────
alter table public.clients              enable row level security;
alter table public.projects             enable row level security;
alter table public.maintenances         enable row level security;
alter table public.maintenance_entries  enable row level security;
alter table public.incidents            enable row level security;
alter table public.technical_accesses   enable row level security;
alter table public.access_log           enable row level security;
alter table public.renewals             enable row level security;
alter table public.infrastructure_items enable row level security;
alter table public.documents            enable row level security;
alter table public.tasks                enable row level security;
alter table public.activity_log         enable row level security;

-- Cualquier usuario autenticado accede a todos los datos (equipo pequeño, v1)
do $$
declare t text;
begin
  foreach t in array array[
    'clients','projects','maintenances','maintenance_entries',
    'incidents','technical_accesses','renewals','infrastructure_items',
    'documents','tasks','activity_log'
  ] loop
    execute format(
      'create policy "authenticated_full_access" on public.%I
       for all to authenticated using (true) with check (true)', t);
  end loop;
end;
$$;

-- access_log: solo INSERT y SELECT (append-only)
drop policy if exists "authenticated_full_access" on public.access_log;
create policy "access_log_select" on public.access_log
  for select to authenticated using (true);
create policy "access_log_insert" on public.access_log
  for insert to authenticated with check (true);
