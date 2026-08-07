-- Trip Planner schema. Safe to run on a fresh project, and safe to re-run.
-- If you already ran the earlier single-user version, this migrates your data.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- join codes

create or replace function public.gen_join_code()
returns text language sql volatile as $$
  -- Ambiguous characters are left out so a code can be read aloud.
  select string_agg(
    substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
           floor(random() * 32 + 1)::int, 1), '')
  from generate_series(1, 6);
$$;

-- ---------------------------------------------------------------- tables

-- Step this out of the way FIRST. The old table was also called "trips", so
-- creating the new one before renaming would leave no trips table at all.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'trips' and column_name = 'user_id'
  ) then
    alter table public.trips rename to trips_legacy;
  end if;
end $$;

create table if not exists public.trips (
  id         uuid primary key default gen_random_uuid(),
  owner      uuid not null references auth.users (id) on delete cascade,
  join_code  text unique not null default public.gen_join_code(),
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.trip_members (
  trip_id   uuid not null references public.trips (id) on delete cascade,
  user_id   uuid not null references auth.users (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (trip_id, user_id)
);

-- Carry across anything saved under the earlier one-row-per-user table.
do $$
begin
  if to_regclass('public.trips_legacy') is not null then
    insert into public.trips (owner, data, updated_at)
    select l.user_id, l.data, l.updated_at
    from public.trips_legacy l
    where not exists (select 1 from public.trips t where t.owner = l.user_id);
  end if;
end $$;

-- ---------------------------------------------------------------- membership

-- The owner is a member of their own trip.
create or replace function public.add_owner_as_member()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.trip_members (trip_id, user_id)
  values (new.id, new.owner)
  on conflict do nothing;
  return new;
end $$;

drop trigger if exists trips_owner_member on public.trips;
create trigger trips_owner_member
  after insert on public.trips
  for each row execute function public.add_owner_as_member();

-- Backfill membership for any trip created before the trigger existed.
insert into public.trip_members (trip_id, user_id)
select id, owner from public.trips
on conflict do nothing;

-- Checked with definer rights so the trips policy can consult trip_members
-- without the two policies recursing into each other.
create or replace function public.is_trip_member(t uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.trip_members m
    where m.trip_id = t and m.user_id = auth.uid()
  );
$$;

-- Joining by code. Runs with definer rights because the joiner cannot read the
-- trip until they are a member, so they could not look the code up themselves.
create or replace function public.join_trip(code text)
returns uuid language plpgsql security definer set search_path = public as $$
declare target uuid;
begin
  if auth.uid() is null then
    raise exception 'Sign in first';
  end if;

  select id into target
  from public.trips
  where join_code = upper(regexp_replace(coalesce(code, ''), '\s', '', 'g'));

  if target is null then
    raise exception 'No trip with that code';
  end if;

  insert into public.trip_members (trip_id, user_id)
  values (target, auth.uid())
  on conflict do nothing;

  return target;
end $$;

-- ---------------------------------------------------------------- policies

alter table public.trips enable row level security;
alter table public.trip_members enable row level security;

drop policy if exists "members read trip"    on public.trips;
drop policy if exists "members write trip"   on public.trips;
drop policy if exists "create own trip"      on public.trips;
drop policy if exists "owner deletes trip"   on public.trips;

create policy "members read trip"  on public.trips for select
  using (public.is_trip_member(id));

create policy "members write trip" on public.trips for update
  using (public.is_trip_member(id))
  with check (public.is_trip_member(id));

create policy "create own trip"    on public.trips for insert
  with check (owner = auth.uid());

create policy "owner deletes trip" on public.trips for delete
  using (owner = auth.uid());

drop policy if exists "read own membership"  on public.trip_members;
drop policy if exists "leave a trip"         on public.trip_members;

create policy "read own membership" on public.trip_members for select
  using (user_id = auth.uid() or public.is_trip_member(trip_id));

create policy "leave a trip" on public.trip_members for delete
  using (user_id = auth.uid());

-- ---------------------------------------------------------------- images

insert into storage.buckets (id, name, public)
values ('trip-images', 'trip-images', true)
on conflict (id) do nothing;

drop policy if exists "trip images are readable" on storage.objects;
drop policy if exists "trip images: own uploads" on storage.objects;
drop policy if exists "trip images: own deletes" on storage.objects;

create policy "trip images are readable" on storage.objects for select
  using (bucket_id = 'trip-images');

create policy "trip images: own uploads" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'trip-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "trip images: own deletes" on storage.objects for delete to authenticated
  using (
    bucket_id = 'trip-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
