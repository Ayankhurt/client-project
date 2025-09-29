import { Injectable } from '@nestjs/common';
import { SearchFilterDto } from './dto/search-filter.dto';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class FiltersService {
  constructor(private prisma: PrismaService) {}

  async search(searchFilterDto: SearchFilterDto): Promise<string[]> {
    const { entityType, conditions } = searchFilterDto;
    // Build dynamic Prisma query
    const where: Record<string, unknown> = { entity_type: entityType };

    for (const cond of conditions) {
      const def = await this.prisma.fieldDefinition.findFirst({
        where: { code: cond.fieldCode },
        orderBy: { version: 'desc' },
      });
      if (!def) continue;

      // Map operator to Prisma query based on type
      let prismaCond: Record<string, unknown> | undefined;
      switch (def.type) {
        case 'TEXT':
          if (cond.operator === 'contains') {
            prismaCond = {
              value: { path: '$', string_contains: String(cond.value) },
            }; // JSON path
          } else if (cond.operator === 'equals') {
            prismaCond = { value: String(cond.value) };
          }
          break;
        case 'NUMBER':
          if (cond.operator === 'gt') {
            prismaCond = { value: { gt: Number(cond.value) } };
          } // etc.
          break;
        // Add cases for other types, using JSON queries since value is Json
      }
      if (prismaCond) {
        const existingAnd = Array.isArray(where.AND)
          ? (where.AND as Record<string, unknown>[])
          : [];
        where.AND = [...existingAnd, prismaCond];
      }
    }

    const results = await this.prisma.fieldValue.findMany({
      where: where,
      select: { entity_id: true },
      distinct: ['entity_id'],
    });
    return results.map((r) => r.entity_id);
  }
}
