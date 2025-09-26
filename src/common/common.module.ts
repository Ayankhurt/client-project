import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // is se ye har jagah available rahega
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class CommonModule {}
