import { Module } from '@nestjs/common';
import { AssignmentsModule } from './assignments/assignments.module';
import { DefinitionsModule } from './definitions/definitions.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [CommonModule, DefinitionsModule, AssignmentsModule],
})
export class AppModule {}
