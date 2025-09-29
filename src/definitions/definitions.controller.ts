import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { DefinitionsService } from './definitions.service';
import { CreateDefinitionDto } from './dto/create-definition.dto';
import { UpdateDefinitionDto } from './dto/update-definition.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('definitions')
@Controller('definitions')
export class DefinitionsController {
  constructor(private readonly definitionsService: DefinitionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new field definition' })
  create(@Body() createDefinitionDto: CreateDefinitionDto) {
    return this.definitionsService.create(createDefinitionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all field definitions (optional filter by code)' })
  findAll(@Query('code') code?: string) {
    return this.definitionsService.findAll(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single field definition by ID' })
  findOne(@Param('id') id: string) {
    return this.definitionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a field definition (creates new version if rules changed)' })
  update(@Param('id') id: string, @Body() updateDefinitionDto: UpdateDefinitionDto) {
    return this.definitionsService.update(id, updateDefinitionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a field definition by ID' })
  remove(@Param('id') id: string) {
    return this.definitionsService.remove(id);
  }
}
