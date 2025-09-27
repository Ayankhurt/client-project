import { Controller, Post, Body } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { FiltersSearchDto } from './dto/filter.dto';

@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Post('search')
  search(@Body() dto: FiltersSearchDto) {
    return this.filtersService.search(dto);
  }
}
