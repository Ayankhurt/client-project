import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FilterCondition {
  @ApiProperty() @IsString() fieldCode: string;
  @ApiProperty() @IsString() operator: string;
  @ApiProperty() value: any;
}

export class SearchFilterDto {
  @ApiProperty() @IsString() entityType: string;
  @ApiProperty({ type: [FilterCondition] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterCondition)
  conditions: FilterCondition[];
}
