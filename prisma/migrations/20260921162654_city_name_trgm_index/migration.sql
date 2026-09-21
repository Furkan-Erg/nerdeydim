-- Enable trigram matching for fast case-insensitive fuzzy city name search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "City_name_trgm_idx" ON "City" USING GIN ("name" gin_trgm_ops);
