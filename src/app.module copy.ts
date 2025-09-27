import { Module } from '@nestjs/common';
import { AssignmentsModule } from './assignments/assignments.module';
import { DefinitionsModule } from './definitions/definitions.module';
import { CommonModule } from './common/common.module';
import { ValuesModule } from './values/values.module';
import { FiltersModule } from './filters/filters.module';

@Module({
  imports: [CommonModule, DefinitionsModule, AssignmentsModule, ValuesModule, FiltersModule],
})
export class AppModule {}
