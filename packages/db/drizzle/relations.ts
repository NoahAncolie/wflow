import { relations } from "drizzle-orm/relations";
import { companies, clients, items, productTypes, providers, unitTypes, quoteItems, quotes, quoteTemplates, users, eventTypes, events, invoices, payments } from "./schema";

export const clientsRelations = relations(clients, ({one, many}) => ({
	company: one(companies, {
		fields: [clients.companyId],
		references: [companies.id]
	}),
	quotes: many(quotes),
	events: many(events),
	invoices: many(invoices),
}));

export const companiesRelations = relations(companies, ({many}) => ({
	clients: many(clients),
	items: many(items),
	productTypes: many(productTypes),
	providers: many(providers),
	quoteTemplates: many(quoteTemplates),
	quotes: many(quotes),
	unitTypes: many(unitTypes),
	users: many(users),
	eventTypes: many(eventTypes),
	events: many(events),
	invoices: many(invoices),
}));

export const itemsRelations = relations(items, ({one, many}) => ({
	company: one(companies, {
		fields: [items.companyId],
		references: [companies.id]
	}),
	productType: one(productTypes, {
		fields: [items.productTypeId],
		references: [productTypes.id]
	}),
	provider: one(providers, {
		fields: [items.providerId],
		references: [providers.id]
	}),
	unitType: one(unitTypes, {
		fields: [items.unitTypeId],
		references: [unitTypes.id]
	}),
	quoteItems: many(quoteItems),
}));

export const productTypesRelations = relations(productTypes, ({one, many}) => ({
	items: many(items),
	company: one(companies, {
		fields: [productTypes.companyId],
		references: [companies.id]
	}),
}));

export const providersRelations = relations(providers, ({one, many}) => ({
	items: many(items),
	company: one(companies, {
		fields: [providers.companyId],
		references: [companies.id]
	}),
}));

export const unitTypesRelations = relations(unitTypes, ({one, many}) => ({
	items: many(items),
	company: one(companies, {
		fields: [unitTypes.companyId],
		references: [companies.id]
	}),
}));

export const quoteItemsRelations = relations(quoteItems, ({one}) => ({
	item: one(items, {
		fields: [quoteItems.itemId],
		references: [items.id]
	}),
	quote: one(quotes, {
		fields: [quoteItems.quoteId],
		references: [quotes.id]
	}),
}));

export const quotesRelations = relations(quotes, ({one, many}) => ({
	quoteItems: many(quoteItems),
	client: one(clients, {
		fields: [quotes.clientId],
		references: [clients.id]
	}),
	company: one(companies, {
		fields: [quotes.companyId],
		references: [companies.id]
	}),
	events: many(events),
	invoices: many(invoices),
	payments: many(payments),
}));

export const quoteTemplatesRelations = relations(quoteTemplates, ({one}) => ({
	company: one(companies, {
		fields: [quoteTemplates.companyId],
		references: [companies.id]
	}),
}));

export const usersRelations = relations(users, ({one}) => ({
	company: one(companies, {
		fields: [users.companyId],
		references: [companies.id]
	}),
}));

export const eventTypesRelations = relations(eventTypes, ({one, many}) => ({
	company: one(companies, {
		fields: [eventTypes.companyId],
		references: [companies.id]
	}),
	events: many(events),
}));

export const eventsRelations = relations(events, ({one}) => ({
	client: one(clients, {
		fields: [events.clientId],
		references: [clients.id]
	}),
	company: one(companies, {
		fields: [events.companyId],
		references: [companies.id]
	}),
	eventType: one(eventTypes, {
		fields: [events.eventTypeId],
		references: [eventTypes.id]
	}),
	quote: one(quotes, {
		fields: [events.quoteId],
		references: [quotes.id]
	}),
}));

export const invoicesRelations = relations(invoices, ({one, many}) => ({
	client: one(clients, {
		fields: [invoices.clientId],
		references: [clients.id]
	}),
	company: one(companies, {
		fields: [invoices.companyId],
		references: [companies.id]
	}),
	quote: one(quotes, {
		fields: [invoices.quoteId],
		references: [quotes.id]
	}),
	payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({one}) => ({
	invoice: one(invoices, {
		fields: [payments.invoiceId],
		references: [invoices.id]
	}),
	quote: one(quotes, {
		fields: [payments.quoteId],
		references: [quotes.id]
	}),
}));