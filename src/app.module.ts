import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma.module';
import { DefinitionsModule } from './definitions/definitions.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { SchemaModule } from './schema/schema.module';
import { ValuesModule } from './values/values.module';
import { FiltersModule } from './filters/filters.module';
import { AggregatesModule } from './aggregates/aggregates.module';
import { JwtAuthGuard } from './common/jwt.guard';

@Module({
  imports: [
    PrismaModule,
    DefinitionsModule,
    AssignmentsModule,
    SchemaModule,
    ValuesModule,
    FiltersModule,
    AggregatesModule,
  ],
  controllers: [AppController],
  providers: [AppService , JwtAuthGuard],
})
export class AppModule {}
