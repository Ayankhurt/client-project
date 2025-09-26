import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Prisma, FieldType } from '@prisma/client';

@Injectable()
export class DefinitionsService {
  constructor(private prisma: PrismaService) {}

  // Create definition
  async create(data: Prisma.FieldDefinitionCreateInput) {
    return this.prisma.fieldDefinition.create({ data });
  }

  // Get all definitions
  async findAll() {
    return this.prisma.fieldDefinition.findMany();
  }

  // Get single definition by id
  async findOne(id: string) {
    return this.prisma.fieldDefinition.findUnique({ where: { id } });
  }

  // ✅ Update with versioning logic
  async update(id: string, data: Prisma.FieldDefinitionUpdateInput) {
    const oldDef = await this.prisma.fieldDefinition.findUnique({ where: { id } });
    if (!oldDef) throw new Error('Definition not found');

    return this.prisma.fieldDefinition.create({
      data: {
        code: oldDef.code,
        name: (data.name as string) ?? oldDef.name,
        type: (data.type as FieldType) ?? oldDef.type,
        validations: (data.validations as any) ?? oldDef.validations,
        version: oldDef.version + 1,
      },
    });
  }

  // Delete definition
  async remove(id: string) {
    return this.prisma.fieldDefinition.delete({ where: { id } });
  }

  // ✅ Schema endpoint – sirf latest version per code
  async getSchema() {
    const allDefs = await this.prisma.fieldDefinition.findMany({
      orderBy: { version: 'desc' },
    });

    // Har `code` ka sirf latest version return kare
    const latestMap = new Map<string, any>();
    for (const def of allDefs) {
      if (!latestMap.has(def.code)) {
        latestMap.set(def.code, def);
      }
    }

    return Array.from(latestMap.values());
  }
}
