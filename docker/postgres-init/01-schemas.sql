-- Runs once, only on a fresh Postgres data volume (see docker-compose.yml).

-- GoTrue's own migrations hardcode grants to a role named `postgres`
-- (the standard Supabase superuser name) regardless of the app's own
-- POSTGRES_USER — create it so those migrations succeed.
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres') THEN
    CREATE ROLE postgres SUPERUSER LOGIN;
  END IF;
END
$$;

-- GoTrue manages its own tables inside `auth`, but expects the schema to
-- already exist — it won't create it itself.
CREATE SCHEMA IF NOT EXISTS auth;
