import { Module } from '@nestjs/common';
import { AggregatesService } from './aggregates.service';
import { AggregatesController } from './aggregates.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [AggregatesController],
  providers: [AggregatesService, PrismaService],
})
export class AggregatesModule {}
