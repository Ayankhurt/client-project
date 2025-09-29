import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateValueDto } from './dto/create-value.dto';
import { CreateBatchValuesDto } from './dto/create-batch-values.dto';
import { UpdateValueDto } from './dto/update-value.dto';
import { FieldValue } from '@prisma/client';

@Injectable()
export class ValuesService {
  constructor(private prisma: PrismaService) {}

  // Create a new value
  async create(dto: CreateValueDto): Promise<FieldValue> {
    // Check if the field exists
    const field = await this.prisma.fieldDefinition.findUnique({
      where: { id: dto.field_id },
    });
    if (!field) throw new BadRequestException('FieldDefinition not found');

    // Ensure value is stored as JSON
    const valueToStore = this.normalizeValue(dto.value);

    return this.prisma.fieldValue.create({
      data: {
        ...dto,
        value: valueToStore,
      },
    });
  }

  // Create multiple values for an entity (batch)
  async createBatch(dto: CreateBatchValuesDto): Promise<FieldValue[]> {
    // Validate all field IDs exist
    const fieldIds = dto.values.map(v => v.field_id);
    const fields = await this.prisma.fieldDefinition.findMany({
      where: { id: { in: fieldIds } },
    });

    if (fields.length !== fieldIds.length) {
      const foundIds = fields.map(f => f.id);
      const missingIds = fieldIds.filter(id => !foundIds.includes(id));
      throw new BadRequestException(`FieldDefinitions not found: ${missingIds.join(', ')}`);
    }

    // Create all values in a transaction
    const values = await this.prisma.$transaction(
      dto.values.map(fieldValue => 
        this.prisma.fieldValue.create({
          data: {
            entity_id: dto.entity_id,
            entity_type: dto.entity_type,
            field_id: fieldValue.field_id,
            value: this.normalizeValue(fieldValue.value),
            created_by: dto.created_by,
          },
        })
      )
    );

    return values;
  }

  // Get values (supports multiple entityIds)
  async findAll(entityType?: string, entityIds?: string[]): Promise<FieldValue[]> {
    return this.prisma.fieldValue.findMany({
      where: {
        entity_type: entityType,
        entity_id: entityIds ? { in: entityIds } : undefined,
      },
      include: { FieldDefinition: true },
    });
  }

  // Get values grouped by entity
  async findAllGroupedByEntity(entityType?: string, entityIds?: string[]): Promise<Record<string, any>> {
    const values = await this.prisma.fieldValue.findMany({
      where: {
        entity_type: entityType,
        entity_id: entityIds ? { in: entityIds } : undefined,
      },
      include: { FieldDefinition: true },
    });

    // Group by entity_id
    const grouped: Record<string, any> = {};
    values.forEach(value => {
      if (!grouped[value.entity_id]) {
        grouped[value.entity_id] = {
          entity_id: value.entity_id,
          entity_type: value.entity_type,
          values: [],
        };
      }
      grouped[value.entity_id].values.push({
        field_id: value.field_id,
        value: value.value,
        field_definition: value.FieldDefinition,
      });
    });

    return grouped;
  }

  // Get single value by ID
  async findOne(id: string): Promise<FieldValue> {
    return this.prisma.fieldValue.findUniqueOrThrow({ where: { id } });
  }

  // Update a value
  async update(id: string, dto: UpdateValueDto): Promise<FieldValue> {
    const existing = await this.prisma.fieldValue.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('FieldValue not found');

    const valueToStore = dto.value !== undefined ? this.normalizeValue(dto.value) : existing.value;

    return this.prisma.fieldValue.update({
      where: { id },
      data: { ...dto, value: valueToStore },
    });
  }

  // Delete a value
  async remove(id: string): Promise<{ message: string }> {
    await this.prisma.fieldValue.delete({ where: { id } });
    return { message: 'Value deleted successfully' };
  }

  // Ensure value is JSON-compatible
  private normalizeValue(value: any): any {
    if (value === null || value === undefined) return null;

    // If array or object, store as-is
    if (typeof value === 'object') return value;

    // Primitives: convert string/number/boolean
    return value;
  }
}
