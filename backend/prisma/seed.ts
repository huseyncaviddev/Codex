import { PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const contractor = await prisma.organization.upsert({ where: { id: '00000000-0000-0000-0000-000000000001' }, update: {}, create: { id: '00000000-0000-0000-0000-000000000001', name: 'Contractor' } });
  const engineer = await prisma.organization.upsert({ where: { id: '00000000-0000-0000-0000-000000000002' }, update: {}, create: { id: '00000000-0000-0000-0000-000000000002', name: 'Engineer' } });
  const employer = await prisma.organization.upsert({ where: { id: '00000000-0000-0000-0000-000000000003' }, update: {}, create: { id: '00000000-0000-0000-0000-000000000003', name: 'Employer' } });

  const passwordHash = await argon2.hash('ChangeMe123!');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@contractor.test' },
    update: {},
    create: {
      email: 'admin@contractor.test',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      organizationId: contractor.id,
      roles: [Role.ORG_ADMIN, Role.DCC],
    },
  });

  const project = await prisma.project.upsert({
    where: { id: '00000000-0000-0000-0000-000000000010' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000010',
      name: 'Demo EPC Megaproject',
      description: 'Seeded project with core parties',
      organizations: {
        create: [
          { organizationId: contractor.id },
          { organizationId: engineer.id },
          { organizationId: employer.id },
        ],
      },
      participants: {
        create: [{ userId: admin.id, roles: [Role.ORG_ADMIN, Role.DCC] }],
      },
    },
  });

  console.log('Seeded organizations, admin user, and project', { project: project.name });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
