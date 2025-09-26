import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DefinitionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.FieldDefinitionCreateInput) {
    return this.prisma.fieldDefinition.create({ data });
  }

  async findAll() {
    return this.prisma.fieldDefinition.findMany({
      include: { assignments: true, values: true },
    });
  }

  async findOne(id: string) {
    const definition = await this.prisma.fieldDefinition.findUnique({
      where: { id },
      include: { assignments: true, values: true },
    });

    if (!definition) throw new NotFoundException('FieldDefinition not found');

    return definition;
  }

  async update(id: string, data: Prisma.FieldDefinitionUpdateInput) {
    return this.prisma.fieldDefinition.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.fieldDefinition.delete({ where: { id } });
  }
}
