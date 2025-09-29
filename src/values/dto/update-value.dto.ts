import { IsOptional } from 'class-validator';

export class UpdateValueDto {
  @IsOptional()
  value?: any;
}
