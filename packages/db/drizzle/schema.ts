import { pgTable, index, foreignKey, uuid, text, timestamp, unique, numeric, integer, jsonb, date, serial } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const clients = pgTable("clients", {
	id: uuid().primaryKey().notNull(),
	companyId: uuid("company_id"),
	firstName: text("first_name"),
	lastName: text("last_name"),
	email: text(),
	phone: text(),
	address: text(),
	zipcode: text(),
	city: text(),
	notes: text(),
	status: text().default('lead'),
	createdAt: timestamp("created_at", { mode: 'string' }),
}, (table) => [
	index("idx_clients_company").using("btree", table.companyId.asc().nullsLast().op("uuid_ops")),
	index("idx_clients_search").using("gin", sql`to_tsvector('french'::regconfig, ((((((first_name || ' '::text)`),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "clients_company_id_fkey"
		}),
]);

export const companies = pgTable("companies", {
	id: uuid().primaryKey().notNull(),
	name: text(),
	siret: text(),
	vatNumber: text("vat_number"),
	address: text(),
	zipcode: text(),
	city: text(),
	phone: text(),
	createdAt: timestamp("created_at", { mode: 'string' }),
}, (table) => [
	unique("companies_siret_key").on(table.siret),
]);

export const items = pgTable("items", {
	id: uuid().primaryKey().notNull(),
	companyId: uuid("company_id"),
	title: text(),
	priceEt: numeric("price_et"),
	unitTypeId: uuid("unit_type_id"),
	productTypeId: uuid("product_type_id"),
	providerId: uuid("provider_id"),
	purchasePrice: numeric("purchase_price"),
	vatRate: numeric("vat_rate").default('20'),
}, (table) => [
	index("items_company_id_idx").using("btree", table.companyId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "items_company_id_fkey"
		}),
	foreignKey({
			columns: [table.productTypeId],
			foreignColumns: [productTypes.id],
			name: "items_product_type_id_fkey"
		}),
	foreignKey({
			columns: [table.providerId],
			foreignColumns: [providers.id],
			name: "items_provider_id_fkey"
		}),
	foreignKey({
			columns: [table.unitTypeId],
			foreignColumns: [unitTypes.id],
			name: "items_unit_type_id_fkey"
		}),
]);

export const productTypes = pgTable("product_types", {
	id: uuid().primaryKey().notNull(),
	companyId: uuid("company_id"),
	title: text(),
	hexColor: text("hex_color").default('#3B82F6'),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "product_types_company_id_fkey"
		}),
]);

export const providers = pgTable("providers", {
	id: uuid().primaryKey().notNull(),
	companyId: uuid("company_id"),
	name: text(),
	reference: text(),
	infos: text(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "providers_company_id_fkey"
		}),
]);

export const quoteItems = pgTable("quote_items", {
	id: uuid().primaryKey().notNull(),
	quoteId: uuid("quote_id"),
	itemId: uuid("item_id"),
	description: text(),
	quantity: numeric(),
	totalEt: numeric("total_et"),
	position: integer(),
}, (table) => [
	foreignKey({
			columns: [table.itemId],
			foreignColumns: [items.id],
			name: "quote_items_item_id_fkey"
		}),
	foreignKey({
			columns: [table.quoteId],
			foreignColumns: [quotes.id],
			name: "quote_items_quote_id_fkey"
		}),
]);

export const quoteTemplates = pgTable("quote_templates", {
	id: uuid().primaryKey().notNull(),
	companyId: uuid("company_id"),
	name: text(),
	items: jsonb(),
	defaultNote: text("default_note"),
	defaultTerms: text("default_terms"),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "quote_templates_company_id_fkey"
		}),
]);

export const quotes = pgTable("quotes", {
	id: uuid().primaryKey().notNull(),
	companyId: uuid("company_id"),
	clientId: uuid("client_id"),
	serialNumber: text("serial_number"),
	version: integer().default(1),
	status: text().default('draft'),
	totalEt: numeric("total_et"),
	totalTtc: numeric("total_ttc"),
	vatAmount: numeric("vat_amount"),
	discountPercent: numeric("discount_percent"),
	downPaymentPercent: numeric("down_payment_percent").default('30'),
	validUntil: date("valid_until"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	sentAt: timestamp("sent_at", { mode: 'string' }),
	acceptedAt: timestamp("accepted_at", { mode: 'string' }),
	noteToClient: text("note_to_client"),
	terms: text(),
}, (table) => [
	index("idx_quotes_status_date").using("btree", table.status.asc().nullsLast().op("text_ops"), table.createdAt.desc().nullsFirst().op("text_ops")),
	index("quotes_client_id_idx").using("btree", table.clientId.asc().nullsLast().op("uuid_ops")),
	index("quotes_company_id_idx").using("btree", table.companyId.asc().nullsLast().op("uuid_ops")),
	index("quotes_serial_number_idx").using("btree", table.serialNumber.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "quotes_client_id_fkey"
		}),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "quotes_company_id_fkey"
		}),
	unique("quotes_serial_number_key").on(table.serialNumber),
]);

export const unitTypes = pgTable("unit_types", {
	id: uuid().primaryKey().notNull(),
	companyId: uuid("company_id"),
	unit: text(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "unit_types_company_id_fkey"
		}),
	unique("unit_types_unit_key").on(table.unit),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: text(),
	passwordHash: text("password_hash"),
	role: text(),
	companyId: uuid("company_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
}, (table) => [
	index("idx_users_company").using("btree", table.companyId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "users_company_id_fkey"
		}),
	unique("users_email_key").on(table.email),
]);

export const eventTypes = pgTable("event_types", {
	id: uuid().primaryKey().notNull(),
	companyId: uuid("company_id"),
	name: text(),
	hexColor: text("hex_color").default('#10B981'),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "event_types_company_id_fkey"
		}),
]);

export const events = pgTable("events", {
	id: uuid().primaryKey().notNull(),
	companyId: uuid("company_id"),
	eventTypeId: uuid("event_type_id"),
	title: text(),
	description: text(),
	startDate: timestamp("start_date", { mode: 'string' }),
	endDate: timestamp("end_date", { mode: 'string' }),
	quoteId: uuid("quote_id"),
	clientId: uuid("client_id"),
	color: text(),
}, (table) => [
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "events_client_id_fkey"
		}),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "events_company_id_fkey"
		}),
	foreignKey({
			columns: [table.eventTypeId],
			foreignColumns: [eventTypes.id],
			name: "events_event_type_id_fkey"
		}),
	foreignKey({
			columns: [table.quoteId],
			foreignColumns: [quotes.id],
			name: "events_quote_id_fkey"
		}),
]);

export const invoices = pgTable("invoices", {
	id: uuid().primaryKey().notNull(),
	companyId: uuid("company_id"),
	quoteId: uuid("quote_id"),
	clientId: uuid("client_id"),
	serialNumber: text("serial_number"),
	status: text(),
	totalTtc: numeric("total_ttc"),
	issuedAt: date("issued_at"),
	dueDate: date("due_date"),
	paidAt: timestamp("paid_at", { mode: 'string' }),
}, (table) => [
	index("idx_invoices_status_date").using("btree", table.status.asc().nullsLast().op("date_ops"), table.issuedAt.desc().nullsFirst().op("date_ops")),
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "invoices_client_id_fkey"
		}),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "invoices_company_id_fkey"
		}),
	foreignKey({
			columns: [table.quoteId],
			foreignColumns: [quotes.id],
			name: "invoices_quote_id_fkey"
		}),
	unique("invoices_serial_number_key").on(table.serialNumber),
]);

export const payments = pgTable("payments", {
	id: uuid().primaryKey().notNull(),
	invoiceId: uuid("invoice_id"),
	quoteId: uuid("quote_id"),
	amount: numeric(),
	method: text(),
	stripePaymentIntentId: text("stripe_payment_intent_id"),
	status: text(),
	createdAt: timestamp("created_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.invoiceId],
			foreignColumns: [invoices.id],
			name: "payments_invoice_id_fkey"
		}),
	foreignKey({
			columns: [table.quoteId],
			foreignColumns: [quotes.id],
			name: "payments_quote_id_fkey"
		}),
]);
