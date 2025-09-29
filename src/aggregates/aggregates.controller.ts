import { Controller, Get, Param } from '@nestjs/common';
import { AggregatesService } from './aggregates.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Aggregates')
@Controller('aggregates')
export class AggregatesController {
  constructor(private readonly aggregatesService: AggregatesService) {}

  @Get(':entityType/:fieldCode')
  @ApiOperation({ summary: 'Get aggregated counts for a field' })
  @ApiParam({ name: 'entityType', example: 'tracking', description: 'Entity type name' })
  @ApiParam({ name: 'fieldCode', example: 'status', description: 'Field code to aggregate' })
  @ApiResponse({
    status: 200,
    description: 'Aggregated results returned successfully',
    schema: {
      example: {
        fieldCode: 'status',
        entityType: 'tracking',
        aggregations: [
          { value: 'active', count: 5 },
          { value: 'inactive', count: 2 },
        ],
        total: 7,
        fieldDefinition: {
          id: 'uuid-here',
          code: 'status',
          name: 'Status',
          type: 'string',
        },
      },
    },
  })
  async aggregate(
    @Param('entityType') entityType: string,
    @Param('fieldCode') fieldCode: string,
  ) {
    return this.aggregatesService.aggregate(entityType, fieldCode);
  }
}
