import { forwardRef, Module } from '@nestjs/common';
import { ImageVersionService } from './image-version.service';
import { ImageVersionController } from './image-version.controller';
import { PrismaService } from 'src/prisma.service';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [forwardRef(() => ImageModule)],
  controllers: [ImageVersionController],
  providers: [ImageVersionService, PrismaService],
  exports: [ImageVersionService]
})
export class ImageVersionModule {}
