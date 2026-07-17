import * as bcrypt from 'bcrypt';

import type { PrismaClient } from '../../src/generated/prisma/client';

const ADMIN_ROLE_NAME = 'ADMIN';
const DEFAULT_ADMIN_EMAIL = 'admin@apcm.pt';
const DEFAULT_ADMIN_PASSWORD = 'Admin@123!';
const DEFAULT_ADMIN_FIRST_NAME = 'Marco';
const DEFAULT_ADMIN_LAST_NAME = 'Oliveira';
const PASSWORD_SALT_ROUNDS = 12;

export async function seedUsers(prisma: PrismaClient): Promise<void> {
  const adminRole = await prisma.role.findUnique({
    where: {
      name: ADMIN_ROLE_NAME,
    },
  });

  if (!adminRole) {
    throw new Error(
      `O perfil ${ADMIN_ROLE_NAME} não foi encontrado. Execute primeiro o seed dos perfis.`,
    );
  }

  const email = process.env.SEED_ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;
  const firstName =
    process.env.SEED_ADMIN_FIRST_NAME ?? DEFAULT_ADMIN_FIRST_NAME;
  const lastName =
    process.env.SEED_ADMIN_LAST_NAME ?? DEFAULT_ADMIN_LAST_NAME;

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      roleId: adminRole.id,
      firstName,
      lastName,
      passwordHash,
      isActive: true,
    },
    create: {
      roleId: adminRole.id,
      email,
      firstName,
      lastName,
      passwordHash,
      isActive: true,
    },
  });

  console.log(`✅ Utilizador administrador criado ou atualizado: ${email}`);
}