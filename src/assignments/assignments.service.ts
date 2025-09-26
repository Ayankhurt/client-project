import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create Assignment
  async create(data: { entity_type: string; field_id: string; order: number; visible?: boolean; filterable?: boolean }) {
    return this.prisma.fieldAssignment.create({
      data: {
        entity_type: data.entity_type,
        order: data.order,
        visible: data.visible ?? true,
        filterable: data.filterable ?? false,
        FieldDefinition: {
          connect: { id: data.field_id }, // ✅ relation connect
        },
      },
      include: { FieldDefinition: true },
    });
  }

  // ✅ Get All
  async findAll() {
    return this.prisma.fieldAssignment.findMany({
      include: { FieldDefinition: true },
    });
  }

  // ✅ Get One
  async findOne(id: string) {
    return this.prisma.fieldAssignment.findUnique({
      where: { id },
      include: { FieldDefinition: true },
    });
  }

  // ✅ Update
  async update(id: string, data: any) {
    return this.prisma.fieldAssignment.update({
      where: { id },
      data,
      include: { FieldDefinition: true },
    });
  }

  // ✅ Delete
  async remove(id: string) {
    return this.prisma.fieldAssignment.delete({
      where: { id },
    });
  }
}
