# Supabase (setup rapido)

## 1) Crea progetto Supabase
- New project
- Prendi:
  - Project URL -> NEXT_PUBLIC_SUPABASE_URL
  - anon public key -> NEXT_PUBLIC_SUPABASE_ANON_KEY
  - service role key -> SUPABASE_SERVICE_ROLE_KEY (SOLO su Vercel)

## 2) Crea tabella prenotazioni
SQL (Supabase → SQL Editor):

```sql
create table if not exists public.prenotazioni (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome text not null,
  telefono text not null,
  servizio text not null,
  data date,
  persone text,
  partenza text,
  destinazione text,
  note text
);
```

## 3) Storage bucket Eventi (locandine) e Foto
- Storage → New bucket → nome: `eventi`
- Public bucket: ✅ ON

- Storage → New bucket → nome: `foto`
- Public bucket: ✅ ON

## 4) Variabili ambiente su Vercel
Project → Settings → Environment Variables:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ADMIN_PASSWORD (scegli tu)
- SUPABASE_EVENTI_BUCKET (opzionale, default: eventi)
- SUPABASE_FOTO_BUCKET (opzionale, default: foto)

Deploy di nuovo.


## 2b) (NUOVO) Tabella eventi
Serve per gestire gli eventi dal pannello admin (titolo, data, bus, locandina).

```sql
create table if not exists public.eventi (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  titolo text not null,
  data date not null,
  bus_tipo text not null check (bus_tipo in ('GT53','GT63','LIMOBUS')),
  locandina_storage_name text not null
);
```

👉 Nota: le locandine restano nello Storage bucket `eventi` (public). In tabella salviamo il **nome file**.

## 2c) (NUOVO) Colonne aggiuntive prenotazioni
Aggiungiamo riferimenti a evento e posti.

```sql
alter table public.prenotazioni
  add column if not exists evento_id uuid,
  add column if not exists posti text;

-- opzionale: collegamento (non obbligatorio)
-- alter table public.prenotazioni
--   add constraint prenotazioni_evento_fk foreign key (evento_id) references public.eventi(id) on delete set null;
```

# 🔥 Upgrade: Eventi con più BUS (GT53 / GT63 / LIMOBUS)

## A) Tabella eventi (base)
Se hai già la tabella `eventi` della versione precedente, puoi:
- **crearne una nuova** `eventi_base` e migrare dopo, oppure
- **modificare** la tabella `eventi` togliendo `bus_tipo`.
Qui ti do la soluzione pulita consigliata: `eventi` (base) + `eventi_bus`.

```sql
-- EVENTO BASE (titolo, data, locandina)
create table if not exists public.eventi (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  titolo text not null,
  data date not null,
  locandina_storage_name text not null
);
```

## B) Tabella bus per evento
```sql
create table if not exists public.eventi_bus (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  evento_id uuid not null references public.eventi(id) on delete cascade,
  bus_tipo text not null check (bus_tipo in ('GT53','GT63','LIMOBUS')),
  capienza int not null default 0
);
```

## C) Aggiornamento tabella prenotazioni
```sql
alter table public.prenotazioni
  add column if not exists evento_id uuid,
  add column if not exists evento_bus_id uuid,
  add column if not exists bus_tipo text,
  add column if not exists posti text;

-- opzionale: vincoli
-- alter table public.prenotazioni
--   add constraint pren_evento_fk foreign key (evento_id) references public.eventi(id) on delete set null;
-- alter table public.prenotazioni
--   add constraint pren_evento_bus_fk foreign key (evento_bus_id) references public.eventi_bus(id) on delete set null;
```

✅ Dopo questi SQL, fai redeploy su Vercel.
