import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FieldType } from '@prisma/client';

export class CreateDefinitionDto {
  @ApiProperty({ example: 'priority', description: 'Unique code for the field' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Task Priority', description: 'Human readable name' })
  @IsString()
  name: string;

  @ApiProperty({ enum: FieldType, description: 'Type of the field' })
  @IsEnum(FieldType)
  type: FieldType;

  @ApiProperty({
    example: '{"options":["High","Medium","Low"]}',
    required: false,
    description: 'Validation rules in JSON format',
  })
  @IsOptional()
  validations?: any;

  @ApiProperty({ example: 1, description: 'Version number of the field' })
  version: number;
}
