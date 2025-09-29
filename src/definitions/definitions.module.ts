import { Module } from '@nestjs/common';

import { DefinitionsService } from './definitions.service';
import { DefinitionsController } from './definitions.controller';

@Module({
  providers: [DefinitionsService],
  controllers: [DefinitionsController],
  exports: [DefinitionsService],
})
export class DefinitionsModule {}
