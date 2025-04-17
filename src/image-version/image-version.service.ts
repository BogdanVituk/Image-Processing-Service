import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Image, ImageVersion } from '@prisma/client';
import { ImageService } from 'src/image/image.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ImageVersionService {
    constructor(
      private prisma: PrismaService,
      @Inject(forwardRef(() => ImageService)) private imageService: ImageService

    ) {}

    async createImageVersion(imageId: number, newPath: string, newFileName: string ): Promise<ImageVersion> {
        const newVersion = await this.prisma.imageVersion.create({
          data: {
            imageId,
            fileName: newFileName,
            path: newPath
          }
        })
    
        return newVersion;
      }
    
    async getImagesVerisons(imageId: number): Promise<ImageVersion[]> {
      return await this.prisma.imageVersion.findMany({
        where: {imageId},
        orderBy: { createAt: 'desc'}
      })
    }
  
    async revertVersion(imageId: number, versionId: number): Promise<Image> {
      const version = await this.prisma.imageVersion.findUnique({where: {id: versionId}})
  
      if(!version) throw new Error("Version not found");
  
  
      return await this.imageService.updateImageData(imageId, version);
    }
}
