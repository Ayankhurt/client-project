import { Controller, Get, Query } from '@nestjs/common';
import { AggregatesService } from './aggregates.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Aggregates')
@Controller('aggregate')
export class AggregatesController {
  constructor(private readonly aggregatesService: AggregatesService) {}

  @Get()
  @ApiQuery({ name: 'entityType', required: true })
  @ApiQuery({ name: 'fieldCode', required: true })
  aggregate(@Query('entityType') entityType: string, @Query('fieldCode') fieldCode: string) {
    return this.aggregatesService.aggregate(entityType, fieldCode);
  }
}
