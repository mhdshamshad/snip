DROP TABLE "sessions";

ALTER TABLE "users"
    ALTER COLUMN "name" SET NOT NULL,
    ALTER COLUMN "password_hash" SET NOT NULL;

ALTER TABLE "urls" ADD COLUMN "last_clicked_at" TIMESTAMPTZ;
