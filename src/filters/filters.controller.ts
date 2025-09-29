import { Controller, Post, Body } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { SearchFilterDto } from './dto/search-filter.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Filters')
@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Post('search')
  @ApiOperation({ summary: 'Search entities using filters' })
  @ApiResponse({ status: 200, description: 'Filtered results returned successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  search(@Body() dto: SearchFilterDto) {
    return this.filtersService.search(dto);
  }
}
