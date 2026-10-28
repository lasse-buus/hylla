import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_page_blocks_promo_cards_cards_tone" AS ENUM('sand', 'blue');
  CREATE TYPE "public"."enum_home_page_blocks_product_list_source" AS ENUM('popular', 'onSale', 'manual');
  CREATE TYPE "public"."enum_home_page_blocks_cta_banner_icon" AS ENUM('gamepad', 'cpu', 'monitor', 'mouse', 'keyboard', 'headphones', 'armchair', 'cable', 'laptop', 'smartphone', 'tv', 'washing-machine', 'coffee');
  CREATE TYPE "public"."enum_home_page_blocks_guide_list_source" AS ENUM('latest', 'manual');
  CREATE TYPE "public"."enum_home_page_blocks_service_highlights_items_icon" AS ENUM('truck', 'return', 'help', 'repair');
  CREATE TABLE "home_page_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"highlight_label" varchar,
  	"highlight_value" varchar,
  	"fine_print" varchar,
  	"image_id" integer NOT NULL,
  	"featured_product_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_category_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_product_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_blocks_product_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"on_sale_only" boolean DEFAULT true,
  	"limit" numeric DEFAULT 4,
  	"fine_print" varchar DEFAULT 'Alle priser er i NOK inkl. mva. Førpris er laveste pris de siste 30 dagene.',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_promo_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"image_id" integer NOT NULL,
  	"link_label" varchar,
  	"link_url" varchar,
  	"product_id" integer,
  	"tone" "enum_home_page_blocks_promo_cards_cards_tone" DEFAULT 'sand'
  );
  
  CREATE TABLE "home_page_blocks_promo_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_product_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"source" "enum_home_page_blocks_product_list_source" DEFAULT 'popular',
  	"limit" numeric DEFAULT 4,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"icon" "enum_home_page_blocks_cta_banner_icon",
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"image_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_guide_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"source" "enum_home_page_blocks_guide_list_source" DEFAULT 'latest',
  	"limit" numeric DEFAULT 3,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_service_highlights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_home_page_blocks_service_highlights_items_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"link_label" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "home_page_blocks_service_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"products_id" integer,
  	"guides_id" integer
  );
  
  ALTER TABLE "home_page_blocks_hero" ADD CONSTRAINT "home_page_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_blocks_hero" ADD CONSTRAINT "home_page_blocks_hero_featured_product_id_products_id_fk" FOREIGN KEY ("featured_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_blocks_hero" ADD CONSTRAINT "home_page_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_category_grid" ADD CONSTRAINT "home_page_blocks_category_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_product_tabs_tabs" ADD CONSTRAINT "home_page_blocks_product_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_product_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_product_tabs" ADD CONSTRAINT "home_page_blocks_product_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_promo_cards_cards" ADD CONSTRAINT "home_page_blocks_promo_cards_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_blocks_promo_cards_cards" ADD CONSTRAINT "home_page_blocks_promo_cards_cards_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_blocks_promo_cards_cards" ADD CONSTRAINT "home_page_blocks_promo_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_promo_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_promo_cards" ADD CONSTRAINT "home_page_blocks_promo_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_product_list" ADD CONSTRAINT "home_page_blocks_product_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_cta_banner" ADD CONSTRAINT "home_page_blocks_cta_banner_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_blocks_cta_banner" ADD CONSTRAINT "home_page_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_guide_list" ADD CONSTRAINT "home_page_blocks_guide_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_service_highlights_items" ADD CONSTRAINT "home_page_blocks_service_highlights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_service_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_service_highlights" ADD CONSTRAINT "home_page_blocks_service_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_guides_fk" FOREIGN KEY ("guides_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_blocks_hero_order_idx" ON "home_page_blocks_hero" USING btree ("_order");
  CREATE INDEX "home_page_blocks_hero_parent_id_idx" ON "home_page_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_hero_path_idx" ON "home_page_blocks_hero" USING btree ("_path");
  CREATE INDEX "home_page_blocks_hero_image_idx" ON "home_page_blocks_hero" USING btree ("image_id");
  CREATE INDEX "home_page_blocks_hero_featured_product_idx" ON "home_page_blocks_hero" USING btree ("featured_product_id");
  CREATE INDEX "home_page_blocks_category_grid_order_idx" ON "home_page_blocks_category_grid" USING btree ("_order");
  CREATE INDEX "home_page_blocks_category_grid_parent_id_idx" ON "home_page_blocks_category_grid" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_category_grid_path_idx" ON "home_page_blocks_category_grid" USING btree ("_path");
  CREATE INDEX "home_page_blocks_product_tabs_tabs_order_idx" ON "home_page_blocks_product_tabs_tabs" USING btree ("_order");
  CREATE INDEX "home_page_blocks_product_tabs_tabs_parent_id_idx" ON "home_page_blocks_product_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_product_tabs_order_idx" ON "home_page_blocks_product_tabs" USING btree ("_order");
  CREATE INDEX "home_page_blocks_product_tabs_parent_id_idx" ON "home_page_blocks_product_tabs" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_product_tabs_path_idx" ON "home_page_blocks_product_tabs" USING btree ("_path");
  CREATE INDEX "home_page_blocks_promo_cards_cards_order_idx" ON "home_page_blocks_promo_cards_cards" USING btree ("_order");
  CREATE INDEX "home_page_blocks_promo_cards_cards_parent_id_idx" ON "home_page_blocks_promo_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_promo_cards_cards_image_idx" ON "home_page_blocks_promo_cards_cards" USING btree ("image_id");
  CREATE INDEX "home_page_blocks_promo_cards_cards_product_idx" ON "home_page_blocks_promo_cards_cards" USING btree ("product_id");
  CREATE INDEX "home_page_blocks_promo_cards_order_idx" ON "home_page_blocks_promo_cards" USING btree ("_order");
  CREATE INDEX "home_page_blocks_promo_cards_parent_id_idx" ON "home_page_blocks_promo_cards" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_promo_cards_path_idx" ON "home_page_blocks_promo_cards" USING btree ("_path");
  CREATE INDEX "home_page_blocks_product_list_order_idx" ON "home_page_blocks_product_list" USING btree ("_order");
  CREATE INDEX "home_page_blocks_product_list_parent_id_idx" ON "home_page_blocks_product_list" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_product_list_path_idx" ON "home_page_blocks_product_list" USING btree ("_path");
  CREATE INDEX "home_page_blocks_cta_banner_order_idx" ON "home_page_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "home_page_blocks_cta_banner_parent_id_idx" ON "home_page_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_cta_banner_path_idx" ON "home_page_blocks_cta_banner" USING btree ("_path");
  CREATE INDEX "home_page_blocks_cta_banner_image_idx" ON "home_page_blocks_cta_banner" USING btree ("image_id");
  CREATE INDEX "home_page_blocks_guide_list_order_idx" ON "home_page_blocks_guide_list" USING btree ("_order");
  CREATE INDEX "home_page_blocks_guide_list_parent_id_idx" ON "home_page_blocks_guide_list" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_guide_list_path_idx" ON "home_page_blocks_guide_list" USING btree ("_path");
  CREATE INDEX "home_page_blocks_service_highlights_items_order_idx" ON "home_page_blocks_service_highlights_items" USING btree ("_order");
  CREATE INDEX "home_page_blocks_service_highlights_items_parent_id_idx" ON "home_page_blocks_service_highlights_items" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_service_highlights_order_idx" ON "home_page_blocks_service_highlights" USING btree ("_order");
  CREATE INDEX "home_page_blocks_service_highlights_parent_id_idx" ON "home_page_blocks_service_highlights" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_service_highlights_path_idx" ON "home_page_blocks_service_highlights" USING btree ("_path");
  CREATE INDEX "home_page_rels_order_idx" ON "home_page_rels" USING btree ("order");
  CREATE INDEX "home_page_rels_parent_idx" ON "home_page_rels" USING btree ("parent_id");
  CREATE INDEX "home_page_rels_path_idx" ON "home_page_rels" USING btree ("path");
  CREATE INDEX "home_page_rels_categories_id_idx" ON "home_page_rels" USING btree ("categories_id");
  CREATE INDEX "home_page_rels_products_id_idx" ON "home_page_rels" USING btree ("products_id");
  CREATE INDEX "home_page_rels_guides_id_idx" ON "home_page_rels" USING btree ("guides_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_page_blocks_hero" CASCADE;
  DROP TABLE "home_page_blocks_category_grid" CASCADE;
  DROP TABLE "home_page_blocks_product_tabs_tabs" CASCADE;
  DROP TABLE "home_page_blocks_product_tabs" CASCADE;
  DROP TABLE "home_page_blocks_promo_cards_cards" CASCADE;
  DROP TABLE "home_page_blocks_promo_cards" CASCADE;
  DROP TABLE "home_page_blocks_product_list" CASCADE;
  DROP TABLE "home_page_blocks_cta_banner" CASCADE;
  DROP TABLE "home_page_blocks_guide_list" CASCADE;
  DROP TABLE "home_page_blocks_service_highlights_items" CASCADE;
  DROP TABLE "home_page_blocks_service_highlights" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_rels" CASCADE;
  DROP TYPE "public"."enum_home_page_blocks_promo_cards_cards_tone";
  DROP TYPE "public"."enum_home_page_blocks_product_list_source";
  DROP TYPE "public"."enum_home_page_blocks_cta_banner_icon";
  DROP TYPE "public"."enum_home_page_blocks_guide_list_source";
  DROP TYPE "public"."enum_home_page_blocks_service_highlights_items_icon";`)
}
