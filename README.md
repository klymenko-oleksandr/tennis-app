# Baseline — Tennis Court Booking & Partner-Finding App

Nx monorepo: NestJS API (`apps/api`) + React/Vite frontend (`apps/web`), Prisma/Postgres, self-hosted Supabase Auth (GoTrue). See [DR.md](./DR.md) for the full design review.

## Quick start

```sh
cp .env.example .env        # fill in GOTRUE_JWT_SECRET (openssl rand -base64 32) and Google OAuth creds
cp apps/web/.env.example apps/web/.env
npm install
npm run dev                 # starts Postgres + GoTrue in Docker, then the API and web dev servers
```

Then, once (or after wiping the DB): `npm run prisma:migrate && npm run prisma:seed`.

- Web: http://localhost:4200
- API: http://localhost:3000/api
- GoTrue: http://localhost:9999

`npm run dev` runs `docker compose up -d` and is safe to re-run — it won't restart containers that are already up. `npm run docker:down` stops them.

## Other useful commands

```sh
npm run prisma:studio       # visual DB browser at http://localhost:5555
npx nx test api             # integration tests hit a real DB — see .env.example's DATABASE_URL_TEST setup
npx nx run-many -t build lint test
```
