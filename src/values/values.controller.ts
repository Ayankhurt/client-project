import { Controller, Post, Get, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ValuesService } from './values.service';
import { CreateValueDto } from './dto/create-value.dto';
import { CreateBatchValuesDto } from './dto/create-batch-values.dto';
import { UpdateValueDto } from './dto/update-value.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('values')
@Controller('values')
export class ValuesController {
  constructor(private readonly valuesService: ValuesService) {}

  // Create a new value
  @Post()
  @ApiOperation({ summary: 'Create a single field value' })
  @ApiBody({
    type: CreateValueDto,
    examples: {
      example1: {
        summary: 'Single text value',
        value: {
          entity_id: 'tracking-123',
          entity_type: 'TRACKING',
          field_id: '89fe0dd4-160f-4b0e-8f81-18a14012d020',
          value: 'High',
          created_by: 'user-1',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Value created successfully' })
  create(@Body() dto: CreateValueDto) {
    return this.valuesService.create(dto);
  }

  // Create multiple values for an entity (batch)
  @Post('batch')
  @ApiOperation({ summary: 'Create multiple field values for an entity' })
  @ApiBody({
    type: CreateBatchValuesDto,
    examples: {
      example1: {
        summary: 'Batch create values',
        value: {
          entity_id: 'tracking-123',
          entity_type: 'TRACKING',
          created_by: 'user-1',
          values: [
            { field_id: '89fe0dd4-160f-4b0e-8f81-18a14012d020', value: 'High' },
            { field_id: '89fe0dd4-160f-4b0e-8f81-18a14012d020', value: '2025-09-29' },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Values created successfully' })
  createBatch(@Body() dto: CreateBatchValuesDto) {
    return this.valuesService.createBatch(dto);
  }

  // Get all values, optionally filtered by entityType and entityIds
  @Get()
  @ApiOperation({ summary: 'Get all field values' })
  @ApiQuery({
    name: 'entityType',
    required: false,
    type: String,
    example: 'TRACKING',
    description: 'Filter values by entity type',
  })
  @ApiQuery({
    name: 'entityIds',
    required: false,
    type: String,
    example: '["tracking-123","tracking-456"]',
    description: 'Comma separated or JSON array of entity IDs',
  })
  @ApiQuery({
    name: 'grouped',
    required: false,
    type: String,
    example: 'true',
    description: 'If true, results are grouped by entity',
  })
  @ApiResponse({
    status: 200,
    description: 'Values retrieved successfully',
    schema: {
      example: [
        {
          id: 'value-uuid',
          entity_id: 'tracking-123',
          entity_type: 'TRACKING',
          field_id: '89fe0dd4-160f-4b0e-8f81-18a14012d020',
          value: 'High',
          FieldDefinition: {
            id: 'priority-id',
            code: 'priority',
            name: 'Priority',
            type: 'MULTI_SELECT',
          },
        },
      ],
    },
  })
  findAll(
    @Query('entityType') entityType?: string,
    @Query('entityIds') entityIds?: string,
    @Query('grouped') grouped?: string,
  ) {
    let ids: string[] | undefined = undefined;

    if (entityIds) {
      try {
        ids = JSON.parse(entityIds);
      } catch (e) {
        ids = [entityIds];
      }
    }

    if (grouped === 'true') {
      return this.valuesService.findAllGroupedByEntity(entityType, ids);
    }

    return this.valuesService.findAll(entityType, ids);
  }

  // Get a single value by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a single field value by ID' })
  @ApiResponse({
    status: 200,
    description: 'Single value retrieved successfully',
    schema: {
      example: {
        id: 'value-uuid',
        entity_id: 'tracking-123',
        entity_type: 'TRACKING',
        field_id: '89fe0dd4-160f-4b0e-8f81-18a14012d020',
        value: 'High',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.valuesService.findOne(id);
  }

  // Update a value
  @Patch(':id')
  @ApiOperation({ summary: 'Update a field value by ID' })
  @ApiBody({
    type: UpdateValueDto,
    examples: {
      example1: {
        summary: 'Update value',
        value: {
          value: 'Medium',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Value updated successfully' })
  update(@Param('id') id: string, @Body() dto: UpdateValueDto) {
    return this.valuesService.update(id, dto);
  }

  // Delete a value
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a field value by ID' })
  @ApiResponse({ status: 200, description: 'Value deleted successfully' })
  remove(@Param('id') id: string) {
    return this.valuesService.remove(id);
  }
}
