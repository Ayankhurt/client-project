import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('schema')
@Controller('schema')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Get()
  @ApiOperation({ summary: 'Get schema for a given entity type' })
  @ApiQuery({
    name: 'entityType',
    type: String,
    required: true,
    example: 'TRACKING',
    description: 'The entity type for which schema should be fetched',
  })
  @ApiResponse({
    status: 200,
    description: 'Schema fetched successfully',
    schema: {
      example: [
        {
          id: 'assignment-uuid',
          entity_type: 'TRACKING',
          field_id: 'field-uuid',
          order: 1,
          visible: true,
          filterable: false,
          FieldDefinition: {
            id: 'field-uuid',
            code: 'priority',
            name: 'Priority',
            type: 'MULTI_SELECT',
            version: 2,
            validations: { options: ['High', 'Medium', 'Low'] },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'entityType is required' })
  async getSchema(@Query('entityType') entityType: string) {
    if (!entityType) {
      throw new BadRequestException('entityType is required');
    }
    return this.schemaService.getSchema(entityType);
  }
}
