import { PrismaClient } from '../../src/generated/prisma/client';

const prisma = new PrismaClient();

export async function seedRoles() {
  const roles = [
    {
      name: 'ADMIN',
      description: 'System Administrator',
    },
    {
      name: 'OWNER',
      description: 'Academy Owner',
    },
    {
      name: 'RECEPTIONIST',
      description: 'Reception Staff',
    },
    {
      name: 'COACH',
      description: 'Padel Coach',
    },
    {
      name: 'MEMBER',
      description: 'Club Member',
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {},
      create: role,
    });
  }

  console.log('✅ Roles seeded');
}