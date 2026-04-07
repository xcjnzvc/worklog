import 'dotenv/config';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  engine: 'classic',
  datasource: {
    url: process.env.DATABASE_URL as string,
    directUrl: process.env.DIRECT_URL as string,
  },
});
