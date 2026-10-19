-- Migración: Perfil personal + módulo de Gym (XSTCH-Logs)
-- Ejecutar en el SQL Editor de Supabase (Project > SQL Editor > New query).
-- Repasá las policies de RLS al final: están escritas permisivas (mismo nivel de acceso
-- que ya usan clients/students/jobs con la anon key), ajustalas si tus otras tablas
-- tienen políticas distintas.

-- ============ PERFIL PERSONAL ============

create table if not exists public.profile (
    id uuid primary key default gen_random_uuid(),
    full_name text not null,
    birth_date date,
    height_cm numeric,
    blood_type text,
    emergency_contact_name text,
    emergency_contact_phone text,
    allergies text,
    chronic_conditions text,
    medications text,
    medical_notes text,
    updated_at timestamptz default now()
);

create table if not exists public.body_measurements (
    id uuid primary key default gen_random_uuid(),
    date date not null,
    weight_kg numeric not null,
    notes text,
    created_at timestamptz default now()
);

create index if not exists body_measurements_date_idx on public.body_measurements (date);

-- ============ GYM ============

create table if not exists public.exercises (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    muscle_group text not null,
    equipment text,
    notes text,
    created_at timestamptz default now()
);

create index if not exists exercises_muscle_group_idx on public.exercises (muscle_group);

create table if not exists public.routines (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    active boolean not null default true,
    created_at timestamptz default now()
);

create table if not exists public.routine_exercises (
    id uuid primary key default gen_random_uuid(),
    routine_id uuid not null references public.routines (id) on delete cascade,
    exercise_id uuid not null references public.exercises (id) on delete cascade,
    "order" integer not null default 1,
    sets_target integer,
    reps_target text,
    notes text
);

create index if not exists routine_exercises_routine_idx on public.routine_exercises (routine_id);
create index if not exists routine_exercises_exercise_idx on public.routine_exercises (exercise_id);

-- ============ RLS (ajustar si tus otras tablas usan otro criterio) ============

alter table public.profile enable row level security;
alter table public.body_measurements enable row level security;
alter table public.exercises enable row level security;
alter table public.routines enable row level security;
alter table public.routine_exercises enable row level security;

create policy "profile_all" on public.profile for all using (true) with check (true);
create policy "body_measurements_all" on public.body_measurements for all using (true) with check (true);
create policy "exercises_all" on public.exercises for all using (true) with check (true);
create policy "routines_all" on public.routines for all using (true) with check (true);
create policy "routine_exercises_all" on public.routine_exercises for all using (true) with check (true);
