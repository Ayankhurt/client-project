import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateValueDto } from './dto/create-value.dto';
import { CreateBatchValuesDto } from './dto/create-batch-values.dto';
import { UpdateValueDto } from './dto/update-value.dto';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class ValuesService {
  constructor(private readonly prisma: PrismaService) {}

  // Single create
  async create(dto: CreateValueDto) {
    return this.prisma.fieldValue.create({
      data: {
        entity_id: dto.entity_id,
        entity_type: dto.entity_type,
        field_id: dto.field_id,
        value: dto.value,
        created_by: dto.created_by,
      },
    });
  }

  // Batch create
  async createBatch(dto: CreateBatchValuesDto) {
    const values = dto.values.map((v) => ({
      entity_id: dto.entity_id,
      entity_type: dto.entity_type,
      field_id: v.field_id,
      value: v.value,
      created_by: dto.created_by,
    }));

    return this.prisma.fieldValue.createMany({
      data: values,
      skipDuplicates: true,
    });
  }

  // Get all
  async findAll(entityType?: string, entityIds?: string[]) {
    return this.prisma.fieldValue.findMany({
      where: {
        entity_type: entityType,
        ...(entityIds ? { entity_id: { in: entityIds } } : {}),
      },
      include: {
        FieldDefinition: true,
      },
    });
  }

  // Grouped by entity
  async findAllGroupedByEntity(entityType?: string, entityIds?: string[]) {
    const values = await this.findAll(entityType, entityIds);

    const grouped: Record<string, any[]> = {};
    values.forEach((val) => {
      if (!grouped[val.entity_id]) {
        grouped[val.entity_id] = [];
      }
      grouped[val.entity_id].push(val);
    });

    return grouped;
  }

  // Get one
  async findOne(id: string) {
    const value = await this.prisma.fieldValue.findUnique({
      where: { id },
      include: { FieldDefinition: true },
    });

    if (!value) {
      throw new NotFoundException(`Value with id ${id} not found`);
    }

    return value;
  }

  // Update
  async update(id: string, dto: UpdateValueDto) {
    return this.prisma.fieldValue.update({
      where: { id },
      data: dto,
    });
  }

  // Delete
  async remove(id: string) {
    return this.prisma.fieldValue.delete({
      where: { id },
    });
  }
}
