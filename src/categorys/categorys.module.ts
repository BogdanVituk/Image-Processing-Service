import { Module } from '@nestjs/common';
import { CategorysService } from './categorys.service';
import { CategorysController } from './categorys.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CategorysController],
  providers: [CategorysService, PrismaService],
})
export class CategorysModule {}
