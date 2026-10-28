import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" ADD COLUMN "rating_breakdown_stars5" numeric;
  ALTER TABLE "products" ADD COLUMN "rating_breakdown_stars4" numeric;
  ALTER TABLE "products" ADD COLUMN "rating_breakdown_stars3" numeric;
  ALTER TABLE "products" ADD COLUMN "rating_breakdown_stars2" numeric;
  ALTER TABLE "products" ADD COLUMN "rating_breakdown_stars1" numeric;
  ALTER TABLE "_products_v" ADD COLUMN "version_rating_breakdown_stars5" numeric;
  ALTER TABLE "_products_v" ADD COLUMN "version_rating_breakdown_stars4" numeric;
  ALTER TABLE "_products_v" ADD COLUMN "version_rating_breakdown_stars3" numeric;
  ALTER TABLE "_products_v" ADD COLUMN "version_rating_breakdown_stars2" numeric;
  ALTER TABLE "_products_v" ADD COLUMN "version_rating_breakdown_stars1" numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" DROP COLUMN "rating_breakdown_stars5";
  ALTER TABLE "products" DROP COLUMN "rating_breakdown_stars4";
  ALTER TABLE "products" DROP COLUMN "rating_breakdown_stars3";
  ALTER TABLE "products" DROP COLUMN "rating_breakdown_stars2";
  ALTER TABLE "products" DROP COLUMN "rating_breakdown_stars1";
  ALTER TABLE "_products_v" DROP COLUMN "version_rating_breakdown_stars5";
  ALTER TABLE "_products_v" DROP COLUMN "version_rating_breakdown_stars4";
  ALTER TABLE "_products_v" DROP COLUMN "version_rating_breakdown_stars3";
  ALTER TABLE "_products_v" DROP COLUMN "version_rating_breakdown_stars2";
  ALTER TABLE "_products_v" DROP COLUMN "version_rating_breakdown_stars1";`)
}
