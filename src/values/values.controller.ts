import { Controller, Post, Get, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ValuesService } from './values.service';
import { CreateValueDto } from './dto/create-value.dto';
import { CreateBatchValuesDto } from './dto/create-batch-values.dto';
import { UpdateValueDto } from './dto/update-value.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Values')
@Controller('values')
export class ValuesController {
  constructor(private readonly valuesService: ValuesService) {}

  // Create a new value
  @Post()
  @ApiOperation({ summary: 'Create a single field value' })
  create(@Body() dto: CreateValueDto) {
    return this.valuesService.create(dto);
  }

  // Create multiple values for an entity (batch)
  @Post('batch')
  @ApiOperation({ summary: 'Create multiple field values for an entity' })
  createBatch(@Body() dto: CreateBatchValuesDto) {
    return this.valuesService.createBatch(dto);
  }

  // Get all values, optionally filtered by entityType and entityIds
  @Get()
  @ApiOperation({ summary: 'Get all field values' })
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
  findOne(@Param('id') id: string) {
    return this.valuesService.findOne(id);
  }

  // Update a value
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateValueDto) {
    return this.valuesService.update(id, dto);
  }

  // Delete a value
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.valuesService.remove(id);
  }
}
