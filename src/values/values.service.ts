import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ValuesService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create new field value
  async create(data: Prisma.FieldValueCreateInput) {
    return this.prisma.fieldValue.create({
      data,
    });
  }

  // ✅ Get values by entity_id
  async findByEntity(entity_id: string) {
    return this.prisma.fieldValue.findMany({
      where: { entity_id },
      include: {
        fieldDefinition: true, // field ka detail bhi milega
      },
    });
  }
}
