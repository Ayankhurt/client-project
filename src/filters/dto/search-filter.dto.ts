import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FilterCondition {
  @ApiProperty({ example: 'status', description: 'Field code to filter on' })
  @IsString()
  fieldCode: string;

  @ApiProperty({ example: '=', description: 'Operator for filtering (e.g. =, !=, >, <)' })
  @IsString()
  operator: string;

  @ApiProperty({ example: 'active', description: 'Value for the condition' })
  value: any;
}

export class SearchFilterDto {
  @ApiProperty({ example: 'tracking', description: 'Entity type being filtered' })
  @IsString()
  entityType: string;

  @ApiProperty({ type: [FilterCondition], description: 'List of filter conditions' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterCondition)
  conditions: FilterCondition[];
}
