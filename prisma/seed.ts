// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Example: Priority field
  const priority = await prisma.fieldDefinition.create({
    data: {
      code: 'priority',
      name: 'Priority',
      type: 'SINGLE_SELECT',
      validations: { options: ['High', 'Medium', 'Low'] },
      version: 1,
    },
  });

  // Assign to TRACKING entity
  await prisma.fieldAssignment.create({
    data: {
      entity_type: 'TRACKING',
      field_id: priority.id,
      order: 1,
      visible: true,
      filterable: true,
    },
  });

  // Example: Kanban tags
  const statusTag = await prisma.fieldDefinition.create({
    data: {
      code: 'status',
      name: 'Status',
      type: 'LABEL',
      validations: { options: [{ code: 'todo', color: 'red' }, { code: 'done', color: 'green' }] },
      version: 1,
    },
  });

  await prisma.fieldAssignment.create({
    data: {
      entity_type: 'TRACKING',
      field_id: statusTag.id,
      order: 2,
      visible: true,
      filterable: true,
    },
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
