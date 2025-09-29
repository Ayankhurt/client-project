import { Injectable } from '@nestjs/common';
import { SearchFilterDto } from './dto/search-filter.dto';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class FiltersService {
  constructor(private prisma: PrismaService) {}

  async search(
    searchFilterDto: SearchFilterDto,
  ): Promise<{ status: string; matchedFields: string[]; entityIds: string[] }> {
    const { entityType, conditions } = searchFilterDto;

    // Base filter
    const where: Record<string, unknown> = { entity_type: entityType.toUpperCase() }; // 🔥 casing safe
    const matchedFields: string[] = [];

    for (const cond of conditions) {
      const def = await this.prisma.fieldDefinition.findFirst({
        where: { code: cond.fieldCode },
        orderBy: { version: 'desc' },
      });
      if (!def) continue;

      let prismaCond: Record<string, unknown> | undefined;

      // Map operator based on type
      switch (def.type) {
        case 'TEXT':
          if (cond.operator === 'contains') {
            prismaCond = {
              value: { string_contains: String(cond.value) },
            };
          } else if (['equals', '='].includes(cond.operator)) {
            prismaCond = { value: { equals: String(cond.value) } };
          }
          break;

        case 'NUMBER':
          if (['gt', '>'].includes(cond.operator)) {
            prismaCond = { value: { gt: Number(cond.value) } };
          } else if (['lt', '<'].includes(cond.operator)) {
            prismaCond = { value: { lt: Number(cond.value) } };
          } else if (['equals', '='].includes(cond.operator)) {
            prismaCond = { value: { equals: Number(cond.value) } };
          }
          break;

        case 'BOOLEAN':
          prismaCond = {
            value: {
              equals:
                cond.value === true ||
                cond.value === 'true' ||
                cond.value === 1,
            },
          };
          break;

        case 'DATE':
          if (cond.operator === 'before') {
            prismaCond = { value: { lt: new Date(cond.value) } };
          } else if (cond.operator === 'after') {
            prismaCond = { value: { gt: new Date(cond.value) } };
          } else if (['equals', '='].includes(cond.operator)) {
            prismaCond = { value: { equals: new Date(cond.value) } };
          }
          break;

        // TODO: add MULTI_SELECT, LABEL etc.
      }

      // Attach condition with field_id
      if (prismaCond) {
        const existingAnd = Array.isArray(where.AND)
          ? (where.AND as Record<string, unknown>[])
          : [];
        where.AND = [...existingAnd, { field_id: def.id, ...prismaCond }];
        matchedFields.push(cond.fieldCode);
      }
    }

    // Query values
    const results = await this.prisma.fieldValue.findMany({
      where,
      select: { entity_id: true },
      distinct: ['entity_id'],
    });

    return {
      status: 'success',
      matchedFields,
      entityIds: results.map((r) => r.entity_id),
    };
  }
}
