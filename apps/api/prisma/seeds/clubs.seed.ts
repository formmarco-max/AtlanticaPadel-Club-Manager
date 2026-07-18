import type { PrismaClient } from '../../src/generated/prisma/client';

const DEFAULT_CLUB = {
  name: 'Atlântica Padel Club',
  slug: 'atlantica-padel-club',
  email: 'geral@atlanticapadel.pt',
  phone: '+351912345678',
  website: 'https://atlanticapadel.pt',
  description: 'Atlântica Padel Club',
  taxNumber: '999999990',
  address: 'Rua da Atlântica',
  postalCode: '1900-000',
  city: 'Barcarena',
  district: 'Oeiras',
  country: 'Portugal',
  isActive: true,
};

export async function seedClubs(
  prisma: PrismaClient,
): Promise<void> {
  await prisma.club.upsert({
    where: {
      slug: DEFAULT_CLUB.slug,
    },
    update: DEFAULT_CLUB,
    create: DEFAULT_CLUB,
  });

  console.log('✅ Clube criado ou atualizado.');
}