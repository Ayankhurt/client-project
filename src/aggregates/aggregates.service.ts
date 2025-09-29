import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AggregatesService {
  constructor(private prisma: PrismaService) {}

  async aggregate(entityType: string, fieldCode: string) {
    // get latest field definition
    const fieldDef = await this.prisma.fieldDefinition.findFirst({
      where: { code: fieldCode },
      orderBy: { version: 'desc' },
    });
    if (!fieldDef) throw new NotFoundException('Field not found');
  
    // fetch all values
    const values = await this.prisma.fieldValue.findMany({
      where: {
        entity_type: entityType.toUpperCase(), // 🔥 casing safe
        field_id: fieldDef.id,
      },
      select: { value: true },
    });
  
    const counts: Record<string, number> = {};
  
    values.forEach((v) => {
      if (v.value === null || v.value === undefined) return;
  
      let val: any = v.value;
  
      // If string but contains JSON → parse
      if (typeof val === 'string') {
        try {
          val = JSON.parse(val);
        } catch {
          // not JSON, keep as string
        }
      }
  
      // If array (multi-select)
      if (Array.isArray(val)) {
        val.forEach((item) => {
          if (item == null) return;
          const key =
            typeof item === 'object' && 'label' in item
              ? String(item.label)
              : String(item);
          counts[key] = (counts[key] || 0) + 1;
        });
        return;
      }
  
      // If object (single select)
      if (typeof val === 'object') {
        const key = 'label' in val ? String(val.label) : JSON.stringify(val);
        counts[key] = (counts[key] || 0) + 1;
        return;
      }
  
      // primitive string/number/boolean
      counts[String(val)] = (counts[String(val)] || 0) + 1;
    });
  
    // Convert to array format for better API response
    const aggregations = Object.entries(counts).map(([value, count]) => ({
      value,
      count,
    }));
  
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  
    return {
      fieldCode,
      entityType,
      aggregations,
      total,
      fieldDefinition: {
        id: fieldDef.id,
        code: fieldDef.code,
        name: fieldDef.name,
        type: fieldDef.type,
      },
    };
  }
  
  }

