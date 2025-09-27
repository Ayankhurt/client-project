import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { FiltersSearchDto } from './dto/filter.dto';

@Injectable()
export class FiltersService {
  constructor(private prisma: PrismaService) {}

  async search(dto: FiltersSearchDto) {
    // Step 1: Get assignments for this entity type
    const assignments = await this.prisma.fieldAssignment.findMany({
      where: { entity_type: dto.entityType },
      include: { FieldDefinition: true },
    });

    // Step 2: Build filter conditions
    const fieldMap = new Map(
      assignments.map(a => [a.FieldDefinition.code, a.field_id]),
    );

    const conditions: any[] = [];
    for (const f of dto.filters) {
      const fieldId = fieldMap.get(f.fieldCode);
      if (!fieldId) continue; // field not found for this entityType

      let condition: any;
      switch (f.operator) {
        case '=':
          condition = { equals: f.value };
          break;
        case '>':
          condition = { gt: f.value };
          break;
        case '<':
          condition = { lt: f.value };
          break;
        case 'contains':
          condition = { contains: f.value, mode: 'insensitive' };
          break;
      }

      conditions.push({
        field_id: fieldId,
        value: condition,
      });
    }

    // Step 3: Query FieldValues
    const values = await this.prisma.fieldValue.findMany({
      where: {
        OR: conditions.map(c => ({
          field_id: c.field_id,
          value: c.value,
        })),
      },
    });

    // Step 4: Return entityIds
    const entityIds = values.map(v => v.entity_id);
    return { entityIds };
  }
}
