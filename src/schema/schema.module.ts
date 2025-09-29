import { Module } from '@nestjs/common';
import { DefinitionsModule } from '../definitions/definitions.module';
import { AssignmentsModule } from '../assignments/assignments.module';
import { SchemaService } from './schema.service';
import { SchemaController } from './schema.controller';

@Module({
  imports: [DefinitionsModule, AssignmentsModule],
  controllers: [SchemaController],
  providers: [SchemaService],
  exports: [SchemaService],
})
export class SchemaModule {}
