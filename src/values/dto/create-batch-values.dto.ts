import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class FieldValueDto {
  @IsString()
  @IsNotEmpty()
  field_id: string;

  @IsNotEmpty()
  value: any;
}

export class CreateBatchValuesDto {
  @IsString()
  @IsNotEmpty()
  entity_id: string;

  @IsString()
  @IsNotEmpty()
  entity_type: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldValueDto)
  values: FieldValueDto[];

  @IsString()
  @IsNotEmpty()
  created_by: string;
}
