import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { FieldAssignment } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  // Create a new assignment
  async create(createDto: CreateAssignmentDto): Promise<FieldAssignment> {
    // Agar field_id empty ho → env ka FIXED_UUID use karo
    const fieldId = createDto.field_id || process.env.FIXED_UUID;

    if (!fieldId) {
      throw new BadRequestException(
        'field_id is required or FIXED_UUID must be set in environment',
      );
    }

    // Check if field_id exists in FieldDefinition
    const fieldExists = await this.prisma.fieldDefinition.findUnique({
      where: { id: fieldId },
    });

    if (!fieldExists) {
      throw new BadRequestException(
        `FieldDefinition with id ${fieldId} does not exist`,
      );
    }

    // Optional: Check if an assignment with the same entity_type and field_id already exists
    const existing = await this.prisma.fieldAssignment.findFirst({
      where: {
        entity_type: createDto.entity_type,
        field_id: fieldId,
      },
    });
    if (existing) {
      throw new BadRequestException(
        `Assignment already exists for entity_type "${createDto.entity_type}" and this field_id`,
      );
    }

    return this.prisma.fieldAssignment.create({
      data: {
        ...createDto,
        field_id: fieldId, // final resolved value
      },
    });
  }

  // Get all assignments or filter by entity type
  async findAll(entityType?: string): Promise<FieldAssignment[]> {
    return this.prisma.fieldAssignment.findMany({
      where: entityType ? { entity_type: entityType } : undefined,
      include: { FieldDefinition: true },
    });
  }

  // Get a single assignment by ID
  async findOne(id: string): Promise<FieldAssignment> {
    return this.prisma.fieldAssignment.findUniqueOrThrow({
      where: { id },
      include: { FieldDefinition: true },
    });
  }

  // Update assignment
  async update(
    id: string,
    updateDto: UpdateAssignmentDto,
  ): Promise<FieldAssignment> {
    const fieldId = updateDto.field_id || process.env.FIXED_UUID;

    // validate agar field_id update me diya gaya ho
    if (fieldId) {
      const fieldExists = await this.prisma.fieldDefinition.findUnique({
        where: { id: fieldId },
      });
      if (!fieldExists) {
        throw new BadRequestException(
          `FieldDefinition with id ${fieldId} does not exist`,
        );
      }
    }

    return this.prisma.fieldAssignment.update({
      where: { id },
      data: {
        ...updateDto,
        field_id: fieldId, // fallback env FIXED_UUID
      },
      include: { FieldDefinition: true },
    });
  }

  // Delete assignment
  async remove(id: string): Promise<{ message: string }> {
    await this.prisma.fieldAssignment.delete({ where: { id } });
    return { message: 'Assignment deleted successfully' };
  }
}
