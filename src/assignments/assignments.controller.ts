import { Controller, Post, Get, Body, Param, Patch, Delete } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}
  
@Post()
create(@Body() body: any) {
  return this.assignmentsService.create(body);
}


  @Get()
  findAll() {
    return this.assignmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.assignmentsService.update(id, {
      entity_type: body.entity_type,
      order: body.order,
      visible: body.visible,
      filterable: body.filterable,
      FieldDefinition: body.field_id
        ? { connect: { id: body.field_id } }
        : undefined,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(id);
  }
}
