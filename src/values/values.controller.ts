import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ValuesService } from './values.service';
import { Prisma } from '@prisma/client';

@Controller('values')
export class ValuesController {
  constructor(private readonly valuesService: ValuesService) {}

  // ✅ POST /values
  @Post()
  create(@Body() data: Prisma.FieldValueCreateInput) {
    return this.valuesService.create(data);
  }

  // ✅ GET /values?entity_id=order-123
  @Get()
  findByEntity(@Query('entity_id') entityId: string) {
    return this.valuesService.findByEntity(entityId);
  }
}
