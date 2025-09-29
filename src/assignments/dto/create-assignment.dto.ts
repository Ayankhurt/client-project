import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty({ example: 'TRACKING', description: 'Entity type where the field is assigned (e.g. TRACKING, PICKING)' })
  @IsString()
  entity_type: string;

  @ApiProperty({ example: 'uuid-of-field', description: 'ID of the field definition to assign' })
  @IsString()
  field_id: string;

  @ApiProperty({ example: 1, description: 'Order of the field in the entity UI' })
  @IsInt()
  order: number;

  @ApiPropertyOptional({ example: true, description: 'Whether the field is visible in the entity UI' })
  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Whether the field is filterable in the entity UI' })
  @IsOptional()
  @IsBoolean()
  filterable?: boolean;
}
