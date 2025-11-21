-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY NOT NULL,
	"company_id" uuid,
	"first_name" text,
	"last_name" text,
	"email" text,
	"phone" text,
	"address" text,
	"zipcode" text,
	"city" text,
	"notes" text,
	"status" text DEFAULT 'lead',
	"created_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "clients" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"siret" text,
	"vat_number" text,
	"address" text,
	"zipcode" text,
	"city" text,
	"phone" text,
	"created_at" timestamp,
	CONSTRAINT "companies_siret_key" UNIQUE("siret")
);
--> statement-breakpoint
ALTER TABLE "companies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"company_id" uuid,
	"title" text,
	"price_et" numeric,
	"unit_type_id" uuid,
	"product_type_id" uuid,
	"provider_id" uuid,
	"purchase_price" numeric,
	"vat_rate" numeric DEFAULT '20'
);
--> statement-breakpoint
ALTER TABLE "items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "product_types" (
	"id" uuid PRIMARY KEY NOT NULL,
	"company_id" uuid,
	"title" text,
	"hex_color" text DEFAULT '#3B82F6'
);
--> statement-breakpoint
ALTER TABLE "product_types" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "providers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"company_id" uuid,
	"name" text,
	"reference" text,
	"infos" text
);
--> statement-breakpoint
ALTER TABLE "providers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "quote_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"quote_id" uuid,
	"item_id" uuid,
	"description" text,
	"quantity" numeric,
	"total_et" numeric,
	"position" integer
);
--> statement-breakpoint
ALTER TABLE "quote_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "quote_templates" (
	"id" uuid PRIMARY KEY NOT NULL,
	"company_id" uuid,
	"name" text,
	"items" jsonb,
	"default_note" text,
	"default_terms" text
);
--> statement-breakpoint
ALTER TABLE "quote_templates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"company_id" uuid,
	"client_id" uuid,
	"serial_number" text,
	"version" integer DEFAULT 1,
	"status" text DEFAULT 'draft',
	"total_et" numeric,
	"total_ttc" numeric,
	"vat_amount" numeric,
	"discount_percent" numeric,
	"down_payment_percent" numeric DEFAULT '30',
	"valid_until" date,
	"created_at" timestamp,
	"sent_at" timestamp,
	"accepted_at" timestamp,
	"note_to_client" text,
	"terms" text,
	CONSTRAINT "quotes_serial_number_key" UNIQUE("serial_number")
);
--> statement-breakpoint
ALTER TABLE "quotes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "unit_types" (
	"id" uuid PRIMARY KEY NOT NULL,
	"company_id" uuid,
	"unit" text,
	CONSTRAINT "unit_types_unit_key" UNIQUE("unit")
);
--> statement-breakpoint
ALTER TABLE "unit_types" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"password_hash" text,
	"role" text,
	"company_id" uuid NOT NULL,
	"created_at" timestamp,
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "event_types" (
	"id" uuid PRIMARY KEY NOT NULL,
	"company_id" uuid,
	"name" text,
	"hex_color" text DEFAULT '#10B981'
);
--> statement-breakpoint
ALTER TABLE "event_types" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"company_id" uuid,
	"event_type_id" uuid,
	"title" text,
	"description" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"quote_id" uuid,
	"client_id" uuid,
	"color" text
);
--> statement-breakpoint
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY NOT NULL,
	"company_id" uuid,
	"quote_id" uuid,
	"client_id" uuid,
	"serial_number" text,
	"status" text,
	"total_ttc" numeric,
	"issued_at" date,
	"due_date" date,
	"paid_at" timestamp,
	CONSTRAINT "invoices_serial_number_key" UNIQUE("serial_number")
);
--> statement-breakpoint
ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"invoice_id" uuid,
	"quote_id" uuid,
	"amount" numeric,
	"method" text,
	"stripe_payment_intent_id" text,
	"status" text,
	"created_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_product_type_id_fkey" FOREIGN KEY ("product_type_id") REFERENCES "public"."product_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_unit_type_id_fkey" FOREIGN KEY ("unit_type_id") REFERENCES "public"."unit_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_types" ADD CONSTRAINT "product_types_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "providers" ADD CONSTRAINT "providers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_templates" ADD CONSTRAINT "quote_templates_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit_types" ADD CONSTRAINT "unit_types_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_types" ADD CONSTRAINT "event_types_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_clients_company" ON "clients" USING btree ("company_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_clients_search" ON "clients" USING gin (to_tsvector('french'::regconfig, ((((((first_name || ' '::text) tsvector_ops);--> statement-breakpoint
CREATE INDEX "items_company_id_idx" ON "items" USING btree ("company_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_quotes_status_date" ON "quotes" USING btree ("status" text_ops,"created_at" text_ops);--> statement-breakpoint
CREATE INDEX "quotes_client_id_idx" ON "quotes" USING btree ("client_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "quotes_company_id_idx" ON "quotes" USING btree ("company_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "quotes_serial_number_idx" ON "quotes" USING btree ("serial_number" text_ops);--> statement-breakpoint
CREATE INDEX "idx_users_company" ON "users" USING btree ("company_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_invoices_status_date" ON "invoices" USING btree ("status" date_ops,"issued_at" date_ops);
*/