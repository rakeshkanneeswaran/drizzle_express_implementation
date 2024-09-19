CREATE TABLE IF NOT EXISTS "PostTable" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserTable" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PostTable" ADD CONSTRAINT "PostTable_userId_UserTable_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."UserTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
