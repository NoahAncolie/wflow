
import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/schema.ts",

  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  schemaFilter: "public",
  tablesFilter: "*",

  introspect: {
    casing: "camel",
  },

  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },

  entities: {
    roles: {
      provider: '',
      exclude: [],
      include: []
    }
  },

  breakpoints: true,
  strict: true,
  verbose: true,
});