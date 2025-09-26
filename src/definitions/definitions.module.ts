import { Module } from '@nestjs/common';
import { DefinitionsService } from './definitions.service';
import { DefinitionsController } from './definitions.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [DefinitionsController],
  providers: [DefinitionsService, PrismaService],
})
export class DefinitionsModule {}
