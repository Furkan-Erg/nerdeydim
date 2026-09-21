# Where Have I Been?

A personal travel tracker: mark the countries and cities you've visited, log
trips with dates/notes/rating/transportation, and explore your history on an
interactive map, a dashboard, a timeline, and a statistics page.

Stack: Next.js (App Router) + TypeScript, Prisma + PostgreSQL, Auth.js
(email/password), Leaflet + OpenStreetMap, Tailwind + shadcn/ui, Recharts.
No AI/LLM features — everything is computed deterministically from your own
trip data.

## Setup

Requires Node.js and Docker (for local Postgres).

```bash
docker compose up -d          # starts Postgres on localhost:5433
npm install
cp .env.example .env          # edit AUTH_SECRET if you want your own
npx prisma migrate deploy     # create tables
npx prisma db seed            # seed ~250 countries + ~33k curated cities
npm run dev
```

Open http://localhost:3000, sign up, and start logging trips.

## Project structure

- `app/` — routes: `(auth)/login|signup`, `(app)/map|dashboard|timeline|statistics|trips`
- `components/` — UI, grouped by feature (`map/`, `trips/`, `statistics/`, `city-picker/`, `layout/`, `ui/` for shadcn primitives)
- `server/actions/` — mutations (create/update/delete trip, signup, add custom city)
- `server/queries/` — reads used by server components
- `lib/stats/aggregate.ts` — all dashboard/timeline/statistics number-crunching
- `lib/auth.ts` / `lib/auth.config.ts` — Auth.js config (split so `proxy.ts` stays Edge-safe)
- `prisma/schema.prisma` — data model; `prisma/seed.ts` — reference data seeding
- `public/data/countries.geojson` — world country boundaries for the map layer

## Notes

- Country boundaries come from `world-atlas` (Natural Earth, public domain);
  country/city reference data from `world-countries` and GeoNames'
  `cities15000` (public license), regenerated via one-off scripts (not
  committed) into `prisma/seed-data/*.json`.
- "Visited" countries/cities are never a stored flag — they're derived from
  the distinct cities/countries appearing across your trips.
- Users can also add a custom city (with manual or click-to-pick
  coordinates) if it's not in the curated list.
