-- Migración: módulo de Vehículos + Problemas (XSTCH-Logs)
-- Ejecutar en el SQL Editor de Supabase (Project > SQL Editor > New query).
-- RLS escrita permisiva, igual que perfil/gym. Ajustala si cambiás el criterio.

-- ============ VEHÍCULOS ============

create table if not exists public.vehicles (
    id uuid primary key default gen_random_uuid(),
    name text not null,                 -- apodo / nombre corto (ej: "El Gol")
    type text not null default 'Auto',  -- Auto, Moto, Camioneta, Otro
    brand text,
    model text,
    year integer,
    plate text,                         -- patente
    color text,
    fuel text,                          -- Nafta, Diésel, GNC, Eléctrico, Híbrido
    mileage_km integer,
    vin text,                           -- número de chasis
    engine_number text,
    insurance_company text,
    insurance_policy text,
    insurance_expiry date,
    vtv_expiry date,
    notes text,
    created_at timestamptz default now()
);

-- ============ PROBLEMAS ============

create table if not exists public.vehicle_problems (
    id uuid primary key default gen_random_uuid(),
    vehicle_id uuid not null references public.vehicles (id) on delete cascade,
    title text not null,
    description text,
    status text not null default 'Pendiente' check (status in ('Pendiente', 'Arreglado')),
    reported_at date not null default current_date,
    fixed_at date,
    cost numeric,
    created_at timestamptz default now()
);

create index if not exists vehicle_problems_vehicle_idx on public.vehicle_problems (vehicle_id);
create index if not exists vehicle_problems_status_idx on public.vehicle_problems (status);

-- ============ RLS ============

alter table public.vehicles enable row level security;
alter table public.vehicle_problems enable row level security;

create policy "vehicles_all" on public.vehicles for all using (true) with check (true);
create policy "vehicle_problems_all" on public.vehicle_problems for all using (true) with check (true);
