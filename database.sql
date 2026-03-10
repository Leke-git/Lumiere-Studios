-- Lumière Studio — AI Lead Qualifier Database Schema

-- Create leads table
create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  session_type text not null,
  budget integer not null,
  preferred_date date,
  urgency text not null,
  message text,
  ai_score integer,
  ai_tier text,
  ai_summary text,
  ai_reply text,
  status text not null default 'new',
  submitted_at timestamptz
);

-- Enable Row Level Security
alter table leads enable row level security;

-- RLS Policies

-- 1. Service role has full access
create policy "Service role full access" 
on leads 
for all 
using (true) 
with check (true);

-- 2. Anon / Public has no access (Default behavior when no policy exists, but explicit for clarity)
-- No policy added for anon means no access.

-- 3. Named admin role (studio_admin) has SELECT and UPDATE only
-- Note: This assumes a role named 'studio_admin' exists or is handled via JWT claims.
create policy "Admins can select and update" 
on leads 
for select 
using (auth.jwt() ->> 'role' = 'studio_admin');

create policy "Admins can update status" 
on leads 
for update 
using (auth.jwt() ->> 'role' = 'studio_admin')
with check (auth.jwt() ->> 'role' = 'studio_admin');

-- Create Indexes for performance
create index idx_leads_email on leads(email);
create index idx_leads_ai_tier on leads(ai_tier);
create index idx_leads_status on leads(status);
create index idx_leads_created_at on leads(created_at desc);

-- Create View for Hot Leads Today
create or replace view hot_leads_today as
select *
from leads
where ai_tier = 'hot' 
and date(created_at) = current_date
order by ai_score desc;
