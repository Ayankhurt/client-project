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
    // Check if field_id exists in FieldDefinition
    const fieldExists = await this.prisma.fieldDefinition.findUnique({
      where: { id: createDto.field_id },
    });

    if (!fieldExists) {
      throw new BadRequestException(
        `FieldDefinition with id ${createDto.field_id} does not exist`,
      );
    }

    // Optional: Check if an assignment with the same entity_type and field_id already exists
    const existing = await this.prisma.fieldAssignment.findFirst({
      where: {
        entity_type: createDto.entity_type,
        field_id: createDto.field_id,
      },
    });
    if (existing) {
      throw new BadRequestException(
        `Assignment already exists for entity_type "${createDto.entity_type}" and this field_id`,
      );
    }

    return this.prisma.fieldAssignment.create({ data: createDto });
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
    // Optional: validate if field_id is being updated
    if (updateDto.field_id) {
      const fieldExists = await this.prisma.fieldDefinition.findUnique({
        where: { id: updateDto.field_id },
      });
      if (!fieldExists) {
        throw new BadRequestException(
          `FieldDefinition with id ${updateDto.field_id} does not exist`,
        );
      }
    }

    return this.prisma.fieldAssignment.update({
      where: { id },
      data: updateDto,
      include: { FieldDefinition: true },
    });
  }

  // Delete assignment
  async remove(id: string): Promise<{ message: string }> {
    await this.prisma.fieldAssignment.delete({ where: { id } });
    return { message: 'Assignment deleted successfully' };
  }
}
