import 'dotenv/config';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  engine: 'classic',
  // 폴더 지정 시 하위 *.prisma 파일을 재귀적으로 병합 (예: company/company.prisma)
  schema: 'src/resources',
  migrations: {
    path: 'migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL as string,
    directUrl: process.env.DIRECT_URL as string,
  },
});
