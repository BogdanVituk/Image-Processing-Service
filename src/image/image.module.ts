import { forwardRef, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { ImageVersionModule } from 'src/image-version/image-version.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [UsersModule, forwardRef(() => ImageVersionModule)],
  controllers: [ImageController],
  providers: [ImageService, PrismaService],
  exports: [ImageService]
})
export class ImageModule {}
