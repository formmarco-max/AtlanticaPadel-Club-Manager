import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client';
import { seedRoles } from './role.seed';

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'A variável de ambiente DATABASE_URL não está configurada.',
    );
  }

  const adapter = new PrismaPg({
    connectionString,
  });

  const prisma = new PrismaClient({
    adapter,
  });

  try {
    console.log('🌱 A iniciar o seed da base de dados...');

    await seedRoles(prisma);

    console.log('✅ Seed da base de dados concluído.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error('❌ Erro durante o seed da base de dados:', error);
  process.exit(1);
});