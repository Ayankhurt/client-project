import { IsString, IsNotEmpty, IsJSON } from 'class-validator';

export class CreateValueDto {
  @IsString()
  @IsNotEmpty()
  entity_id: string;

  @IsString()
  @IsNotEmpty()
  entity_type: string;

  @IsString()
  @IsNotEmpty()
  field_id: string;

  @IsNotEmpty()
  value: any;

  @IsString()
  @IsNotEmpty()
  created_by: string;
}
