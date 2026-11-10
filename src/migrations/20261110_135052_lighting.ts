import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_categories_layout" AS ENUM('standard', 'lighting');
  CREATE TYPE "public"."enum_products_lighting_works_with" AS ENUM('bridge', 'bluetooth', 'matter', 'apple-home');
  CREATE TYPE "public"."enum_products_lighting_capability" AS ENUM('white', 'ambiance', 'color', 'filament', 'bridge');
  CREATE TYPE "public"."enum_products_lighting_illustration" AS ENUM('a60', 'globe', 'gu10', 'strip', 'go', 'iris', 'candle', 'bridge');
  CREATE TYPE "public"."enum_products_lighting_socket" AS ENUM('E27', 'E14', 'GU10');
  CREATE TYPE "public"."enum__products_v_version_lighting_works_with" AS ENUM('bridge', 'bluetooth', 'matter', 'apple-home');
  CREATE TYPE "public"."enum__products_v_version_lighting_capability" AS ENUM('white', 'ambiance', 'color', 'filament', 'bridge');
  CREATE TYPE "public"."enum__products_v_version_lighting_illustration" AS ENUM('a60', 'globe', 'gu10', 'strip', 'go', 'iris', 'candle', 'bridge');
  CREATE TYPE "public"."enum__products_v_version_lighting_socket" AS ENUM('E27', 'E14', 'GU10');
  CREATE TABLE "products_lighting_works_with" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_products_lighting_works_with",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_products_v_version_lighting_works_with" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__products_v_version_lighting_works_with",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "categories" ADD COLUMN "layout" "enum_categories_layout" DEFAULT 'standard';
  ALTER TABLE "products" ADD COLUMN "lighting_capability" "enum_products_lighting_capability";
  ALTER TABLE "products" ADD COLUMN "lighting_illustration" "enum_products_lighting_illustration";
  ALTER TABLE "products" ADD COLUMN "lighting_opal" boolean;
  ALTER TABLE "products" ADD COLUMN "lighting_gradient" boolean;
  ALTER TABLE "products" ADD COLUMN "lighting_socket" "enum_products_lighting_socket";
  ALTER TABLE "products" ADD COLUMN "lighting_lumen" numeric;
  ALTER TABLE "products" ADD COLUMN "lighting_kelvin_min" numeric;
  ALTER TABLE "products" ADD COLUMN "lighting_kelvin_max" numeric;
  ALTER TABLE "_products_v" ADD COLUMN "version_lighting_capability" "enum__products_v_version_lighting_capability";
  ALTER TABLE "_products_v" ADD COLUMN "version_lighting_illustration" "enum__products_v_version_lighting_illustration";
  ALTER TABLE "_products_v" ADD COLUMN "version_lighting_opal" boolean;
  ALTER TABLE "_products_v" ADD COLUMN "version_lighting_gradient" boolean;
  ALTER TABLE "_products_v" ADD COLUMN "version_lighting_socket" "enum__products_v_version_lighting_socket";
  ALTER TABLE "_products_v" ADD COLUMN "version_lighting_lumen" numeric;
  ALTER TABLE "_products_v" ADD COLUMN "version_lighting_kelvin_min" numeric;
  ALTER TABLE "_products_v" ADD COLUMN "version_lighting_kelvin_max" numeric;
  ALTER TABLE "products_lighting_works_with" ADD CONSTRAINT "products_lighting_works_with_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_lighting_works_with" ADD CONSTRAINT "_products_v_version_lighting_works_with_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_lighting_works_with_order_idx" ON "products_lighting_works_with" USING btree ("order");
  CREATE INDEX "products_lighting_works_with_parent_idx" ON "products_lighting_works_with" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_lighting_works_with_order_idx" ON "_products_v_version_lighting_works_with" USING btree ("order");
  CREATE INDEX "_products_v_version_lighting_works_with_parent_idx" ON "_products_v_version_lighting_works_with" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "products_lighting_works_with" CASCADE;
  DROP TABLE "_products_v_version_lighting_works_with" CASCADE;
  ALTER TABLE "categories" DROP COLUMN "layout";
  ALTER TABLE "products" DROP COLUMN "lighting_capability";
  ALTER TABLE "products" DROP COLUMN "lighting_illustration";
  ALTER TABLE "products" DROP COLUMN "lighting_opal";
  ALTER TABLE "products" DROP COLUMN "lighting_gradient";
  ALTER TABLE "products" DROP COLUMN "lighting_socket";
  ALTER TABLE "products" DROP COLUMN "lighting_lumen";
  ALTER TABLE "products" DROP COLUMN "lighting_kelvin_min";
  ALTER TABLE "products" DROP COLUMN "lighting_kelvin_max";
  ALTER TABLE "_products_v" DROP COLUMN "version_lighting_capability";
  ALTER TABLE "_products_v" DROP COLUMN "version_lighting_illustration";
  ALTER TABLE "_products_v" DROP COLUMN "version_lighting_opal";
  ALTER TABLE "_products_v" DROP COLUMN "version_lighting_gradient";
  ALTER TABLE "_products_v" DROP COLUMN "version_lighting_socket";
  ALTER TABLE "_products_v" DROP COLUMN "version_lighting_lumen";
  ALTER TABLE "_products_v" DROP COLUMN "version_lighting_kelvin_min";
  ALTER TABLE "_products_v" DROP COLUMN "version_lighting_kelvin_max";
  DROP TYPE "public"."enum_categories_layout";
  DROP TYPE "public"."enum_products_lighting_works_with";
  DROP TYPE "public"."enum_products_lighting_capability";
  DROP TYPE "public"."enum_products_lighting_illustration";
  DROP TYPE "public"."enum_products_lighting_socket";
  DROP TYPE "public"."enum__products_v_version_lighting_works_with";
  DROP TYPE "public"."enum__products_v_version_lighting_capability";
  DROP TYPE "public"."enum__products_v_version_lighting_illustration";
  DROP TYPE "public"."enum__products_v_version_lighting_socket";`)
}
