ALTER TABLE "PostTable" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "UserTable" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();