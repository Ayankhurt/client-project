import { Injectable } from '@nestjs/common';
import { AssignmentsService } from '../assignments/assignments.service';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class SchemaService {
  constructor(
    private prisma: PrismaService,
    private assignmentsService: AssignmentsService,
  ) {}

  async getSchema(entityType: string) {
    const assignments = await this.prisma.fieldAssignment.findMany({
      where: { entity_type: entityType },
      include: { FieldDefinition: true },
    });
    // Get latest versions only
    const latestDefinitions = await Promise.all(
      assignments.map(async (assign) => {
        const defs = await this.prisma.fieldDefinition.findMany({
          where: { code: assign.FieldDefinition.code },
          orderBy: { version: 'desc' },
          take: 1,
        });
        return { ...assign, FieldDefinition: defs[0] };
      }),
    );
    return latestDefinitions.sort((a, b) => a.order - b.order);
  }
}
