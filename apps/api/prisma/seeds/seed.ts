import { seedRoles } from './role.seed';

async function main() {
  await seedRoles();

  console.log('🌱 Database Seed Completed');
}

main();