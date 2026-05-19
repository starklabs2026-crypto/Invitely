-- ============================================================
-- Migration: Ingestion pipeline schema
-- Creates tables and columns needed for the AI ingestion CLI.
-- Safe to re-run (uses IF NOT EXISTS / DO NOTHING patterns).
-- ============================================================

-- ── 1. ingestion_jobs ────────────────────────────────────────────────────────
-- One row per template being processed by the CLI.

create table if not exists ingestion_jobs (
  id               uuid primary key default gen_random_uuid(),
  template_id      text not null references templates(id) on delete cascade,
  status           text not null default 'queued'
                     check (status in ('queued','processing','needs_review','approved','failed')),
  source_image_url text not null,
  extracted_bg_url text,
  ai_model_used    text,
  error_log        text,
  created_at       timestamptz not null default now(),
  completed_at     timestamptz
);

create index if not exists ingestion_jobs_template_id_idx on ingestion_jobs(template_id);
create index if not exists ingestion_jobs_status_idx      on ingestion_jobs(status);

-- ── 2. ingestion_zone_reviews ─────────────────────────────────────────────────
-- AI-proposed text zones awaiting human approval before going live.

create table if not exists ingestion_zone_reviews (
  id              uuid primary key default gen_random_uuid(),
  job_id          uuid not null references ingestion_jobs(id) on delete cascade,
  template_id     text not null references templates(id) on delete cascade,
  proposed_zones  jsonb not null default '[]',
  review_status   text not null default 'ai_draft'
                    check (review_status in ('ai_draft','approved','rejected')),
  reviewer_notes  text,
  reviewed_by     uuid references auth.users(id),
  reviewed_at     timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists zone_reviews_job_id_idx      on ingestion_zone_reviews(job_id);
create index if not exists zone_reviews_template_id_idx on ingestion_zone_reviews(template_id);
create index if not exists zone_reviews_status_idx      on ingestion_zone_reviews(review_status);

-- ── 3. New columns on templates ───────────────────────────────────────────────

alter table templates
  add column if not exists review_status  text default 'manual'
                                            check (review_status in ('manual','ai_draft','pending_review','approved')),
  add column if not exists ai_confidence  float,
  add column if not exists draft_zones    jsonb,
  add column if not exists text_zones_v2  jsonb;

-- Mark existing 17 templates as manually curated (already approved)
update templates
set review_status = 'manual'
where review_status is null;

-- ── 4. RLS policies ───────────────────────────────────────────────────────────
-- ingestion tables are internal — only service role (CLI) can write,
-- authenticated users cannot read them directly.

alter table ingestion_jobs          enable row level security;
alter table ingestion_zone_reviews  enable row level security;

-- No select policy = no public read access.
-- The CLI uses the service role key which bypasses RLS.
