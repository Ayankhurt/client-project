import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateDefinitionDto } from './dto/create-definition.dto';
import { UpdateDefinitionDto } from './dto/update-definition.dto';
import { FieldDefinition, FieldType } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class DefinitionsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createDefinitionDto: CreateDefinitionDto,
  ): Promise<FieldDefinition> {
    const { code, version } = createDefinitionDto;
    const existing = await this.prisma.fieldDefinition.findUnique({
      where: { code_version: { code, version } },
    });
    if (existing) {
      throw new BadRequestException(
        'Definition with this code and version already exists',
      );
    }

    // Parse validations if provided
    let validations;
    if (createDefinitionDto.validations) {
      if (typeof createDefinitionDto.validations === 'string') {
        validations = JSON.parse(createDefinitionDto.validations) as Record<string, unknown>;
      } else {
        validations = createDefinitionDto.validations as Record<string, unknown>;
      }
    }

    // Validate based on type (implement type-specific validation logic here)
    this.validateDefinition(createDefinitionDto.type, validations);

    return this.prisma.fieldDefinition.create({
      data: {
        ...createDefinitionDto,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        validations: validations as any,
      },
    });
  }

  async findAll(code?: string): Promise<FieldDefinition[]> {
    return this.prisma.fieldDefinition.findMany({
      where: code ? { code } : undefined,
      orderBy: { version: 'desc' },
    });
  }

  async findOne(id: string): Promise<FieldDefinition> {
    return this.prisma.fieldDefinition.findUniqueOrThrow({ where: { id } });
  }

  async update(
    id: string,
    updateDefinitionDto: Partial<CreateDefinitionDto>, // allow partial updates
  ): Promise<FieldDefinition> {
    // 1️⃣ Fetch existing definition
    const existing = await this.prisma.fieldDefinition.findUnique({ where: { id } });
    if (!existing) throw new BadRequestException('Definition not found');
  
    // 2️⃣ Parse validations if provided
    const newValidations = updateDefinitionDto.validations
      ? (typeof updateDefinitionDto.validations === 'string'
          ? (JSON.parse(updateDefinitionDto.validations) as Record<string, unknown>)
          : updateDefinitionDto.validations)
      : existing.validations;
  
    // 3️⃣ Determine if a new version is required
    const needsNewVersion =
      (updateDefinitionDto.type && updateDefinitionDto.type !== existing.type) ||
      (updateDefinitionDto.validations &&
        JSON.stringify(newValidations) !== JSON.stringify(existing.validations));
  
    // 4️⃣ If new version needed, create new row
    if (needsNewVersion) {
      return this.prisma.fieldDefinition.create({
        data: {
          code: existing.code, // keep same code
          name: updateDefinitionDto.name ?? existing.name,
          type: updateDefinitionDto.type ?? existing.type,
          validations: newValidations as any,
          version: existing.version + 1,
        },
      });
    }
  
    // 5️⃣ Otherwise, update in place
    return this.prisma.fieldDefinition.update({
      where: { id },
      data: {
        name: updateDefinitionDto.name ?? existing.name,
        type: updateDefinitionDto.type ?? existing.type,
        validations: newValidations as any,
      },
    });
  }
  

  async remove(id: string): Promise<FieldDefinition> {
    return this.prisma.fieldDefinition.delete({ where: { id } });
  }

  private validateDefinition(
    type: FieldType,
    validations: Record<string, unknown> | undefined,
  ) {
    // Implement validation logic based on type, e.g.
    if (
      type === 'SINGLE_SELECT' &&
      (!validations?.options || !Array.isArray(validations.options))
    ) {
      throw new BadRequestException('SINGLE_SELECT requires options array');
    }
    // Add more for other types, required, range, etc.
  }
}
