import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_preferences_interests" AS ENUM('gaming', 'pc-og-data', 'mobil-og-nettbrett', 'tv-og-lyd', 'hjem-og-kjokken', 'tilbehor');
  CREATE TYPE "public"."enum_orders_placed_via" AS ENUM('seed', 'checkout');
  CREATE TABLE "users_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"is_default" boolean,
  	"address_line" varchar,
  	"postal_code" varchar,
  	"city" varchar
  );
  
  CREATE TABLE "users_preferences_interests" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_preferences_interests",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "phone" varchar;
  ALTER TABLE "users" ADD COLUMN "customer_since" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "preferences_newsletter" boolean;
  ALTER TABLE "users" ADD COLUMN "preferences_sms_offers" boolean;
  ALTER TABLE "users" ADD COLUMN "preferences_delivery_sms" boolean;
  ALTER TABLE "users" ADD COLUMN "preferences_back_in_stock" boolean;
  ALTER TABLE "orders" ADD COLUMN "placed_via" "enum_orders_placed_via" DEFAULT 'seed';
  ALTER TABLE "users_addresses" ADD CONSTRAINT "users_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_preferences_interests" ADD CONSTRAINT "users_preferences_interests_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_addresses_order_idx" ON "users_addresses" USING btree ("_order");
  CREATE INDEX "users_addresses_parent_id_idx" ON "users_addresses" USING btree ("_parent_id");
  CREATE INDEX "users_preferences_interests_order_idx" ON "users_preferences_interests" USING btree ("order");
  CREATE INDEX "users_preferences_interests_parent_idx" ON "users_preferences_interests" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_addresses" CASCADE;
  DROP TABLE "users_preferences_interests" CASCADE;
  ALTER TABLE "users" DROP COLUMN "phone";
  ALTER TABLE "users" DROP COLUMN "customer_since";
  ALTER TABLE "users" DROP COLUMN "preferences_newsletter";
  ALTER TABLE "users" DROP COLUMN "preferences_sms_offers";
  ALTER TABLE "users" DROP COLUMN "preferences_delivery_sms";
  ALTER TABLE "users" DROP COLUMN "preferences_back_in_stock";
  ALTER TABLE "orders" DROP COLUMN "placed_via";
  DROP TYPE "public"."enum_users_preferences_interests";
  DROP TYPE "public"."enum_orders_placed_via";`)
}
