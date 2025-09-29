import { Controller, Post, Body } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { SearchFilterDto } from './dto/search-filter.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Filters')
@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Post('search')
  search(@Body() dto: SearchFilterDto) {
    return this.filtersService.search(dto);
  }
}
