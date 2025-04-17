import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ImageVersionService } from './image-version.service';
import { Image, ImageVersion } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('image-version')
@UseGuards(JwtAuthGuard) 
export class ImageVersionController {
  constructor(private readonly imageVersionService: ImageVersionService) {}

  @Get('/:imageId')
  async getVersionsImages(@Param('imageId') imageId: string): Promise<ImageVersion[]> {
    return await this.imageVersionService.getImagesVerisons(+imageId)
  }

  @Put(':imageId/versions/:versionId')
  async revertToVersion(
    @Param('imageId') imageId: string,
    @Param('versionId') versionId: string
  ): Promise<Image> {
    return await this.imageVersionService.revertVersion(+imageId, +versionId)
  }

  @Post('/create-version')
  async createVerionsImages(@Body() body: {imageId: number, newPath: string, newFileName: string }): Promise<ImageVersion> {
    return this.imageVersionService.createImageVersion(body.imageId, body.newPath, body.newPath)
  }
}
