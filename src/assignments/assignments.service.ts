import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.FieldAssignmentCreateInput) {
    return this.prisma.fieldAssignment.create({ data });
  }

  findAll() {
    return this.prisma.fieldAssignment.findMany({
      include: { FieldDefinition: true },
    });
  }

  async findOne(id: string) {
    const assignment = await this.prisma.fieldAssignment.findUnique({
      where: { id },
      include: { FieldDefinition: true },
    });
    if (!assignment) throw new NotFoundException(`Assignment ${id} not found`);
    return assignment;
  }

  update(id: string, data: Prisma.FieldAssignmentUpdateInput) {
    return this.prisma.fieldAssignment.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.fieldAssignment.delete({ where: { id } });
  }
}
