import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('assignments')
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new field assignment' })
  create(@Body() createDto: CreateAssignmentDto) {
    return this.assignmentsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assignments (optional filter by entity type)' })
  @ApiQuery({ name: 'entityType', required: false, description: 'Filter by entity type (e.g. TRACKING)' })
  findAll(@Query('entityType') entityType?: string) {
    return this.assignmentsService.findAll(entityType);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single assignment by ID' })
  @ApiParam({ name: 'id', description: 'Assignment ID (UUID)' })
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an assignment by ID' })
  @ApiParam({ name: 'id', description: 'Assignment ID (UUID)' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an assignment by ID' })
  @ApiParam({ name: 'id', description: 'Assignment ID (UUID)' })
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(id);
  }
}
