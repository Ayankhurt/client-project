import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { DefinitionsService } from './definitions.service';
import { Prisma } from '@prisma/client';

@Controller('definitions')
export class DefinitionsController {
  constructor(private readonly definitionsService: DefinitionsService) {}

  @Post()
  create(@Body() data: Prisma.FieldDefinitionCreateInput) {
    return this.definitionsService.create(data);
  }

  @Get()
  findAll() {
    return this.definitionsService.findAll();
  }

  @Get('/schema')
  getSchema() {
    return this.definitionsService.getSchema();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.definitionsService.findOne(id); // id string hoga (UUID)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: Prisma.FieldDefinitionUpdateInput,
  ) {
    return this.definitionsService.update(id, data); // id string hoga
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.definitionsService.remove(id); // id string hoga
  }
}
