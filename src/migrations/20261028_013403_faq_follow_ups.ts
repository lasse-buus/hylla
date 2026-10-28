import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "faqs" ALTER COLUMN "topic" DROP NOT NULL;
  ALTER TABLE "faqs" ADD COLUMN "parent_id" integer;
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_parent_id_faqs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "faqs_parent_idx" ON "faqs" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "faqs" DROP CONSTRAINT "faqs_parent_id_faqs_id_fk";
  
  DROP INDEX "faqs_parent_idx";
  ALTER TABLE "faqs" ALTER COLUMN "topic" SET NOT NULL;
  ALTER TABLE "faqs" DROP COLUMN "parent_id";`)
}
