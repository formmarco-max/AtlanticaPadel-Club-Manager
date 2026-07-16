import type { PrismaClient } from '../../src/generated/prisma/client';

type RoleSeedData = {
  name: string;
  description: string;
};

const roles: RoleSeedData[] = [
  {
    name: 'ADMIN',
    description: 'Administrador do sistema',
  },
  {
    name: 'OWNER',
    description: 'Proprietário da academia',
  },
  {
    name: 'RECEPTIONIST',
    description: 'Rececionista da academia',
  },
  {
    name: 'COACH',
    description: 'Treinador de pádel',
  },
  {
    name: 'MEMBER',
    description: 'Sócio da academia',
  },
];

export async function seedRoles(prisma: PrismaClient): Promise<void> {
  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {
        description: role.description,
      },
      create: role,
    });
  }

  console.log('✅ Perfis de utilizador criados ou atualizados.');
}