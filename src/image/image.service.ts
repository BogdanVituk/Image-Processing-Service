import { HttpException, Injectable, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { PrismaService } from 'src/prisma.service';
import { join } from 'path';
import * as sharp from 'sharp';
import type { Multer } from 'multer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UsersService } from 'src/users/users.service';
import { ImageVersionService } from 'src/image-version/image-version.service';
import { Image, ImageVersion } from '@prisma/client';

@Injectable()
export class ImageService {

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private usersService: UsersService,
    @Inject(forwardRef(() => ImageVersionService)) private imageVersionsService: ImageVersionService
  ) {}

  async upload(file: Multer.File, dto: CreateImageDto): Promise<Image> {

    const { userId, tags, categories } = dto;

    const user = await this.usersService.getUserById(+userId);

    if(user.accountType == 'FREE' && user.uploatedImage > 5) {
        throw new HttpException('You have reached the upload limit for free accounts.',
          HttpStatus.FORBIDDEN
        )
    } else if (user.accountType == "PAID" && user.uploatedImage > 100) {
        throw new HttpException('You have reached the upload limit for free accounts.',
          HttpStatus.FORBIDDEN
        )
      
    } 

    const tagRecords = await Promise.all(
      tags.map(async (tagName) => {
        return await this.prisma.tag.upsert({
          where: {name: tagName},
          update: {},
          create: {name: tagName}
        })
      })
    ) 

    const categoriesRecords = await Promise.all(
      categories.map(async (categoryName) => {
        return await this.prisma.category.upsert({
          where: {name: categoryName},
          update: {},
          create: {name: categoryName}
        })
      })
    )

    const newImage = await this.prisma.image.create({
      data: {
          fileName: file.filename,
          path: `uploads/${file.filename}`,
          ownerId: +userId,
          tags: {
            connect: tagRecords.map(tag => ({id: tag.id}))
          },
          categoryes: {
            connect: categoriesRecords.map(category => ({id: category.id}))
          },
      },
      include: {
        tags: true,
        categoryes: true
      }
  })
    
    await this.usersService.updateUserUploadOrTransform('upload',user, 1);
    await this.imageVersionsService.createImageVersion(newImage.id, newImage.fileName, newImage.path);  
    

    return newImage;
  }

  async transform(filename: string, width: string, height: string, format: string, res): Promise<Image> {
      const cacheKey = `${filename}-${width}-${height}-${format}`;
      const cachedImage = await this.cacheManager.get<Buffer>(cacheKey);
      const newFileName = `${cacheKey}.${format}`

      if(cachedImage) {
        res.setHeader('Content-Type', `image/${format || 'jpeg'}`);
        return res.end(cachedImage);
      }

      const filePath = join(process.cwd(), 'uploads', filename)

      if(!filePath) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND)
      }

      const image = await this.prisma.image.findUnique({where: {fileName: filename}})
      const user = await this.usersService.getUserById(image.ownerId);

      if(user.accountType == 'FREE' && user.transformedImage >= 10) {
        throw new HttpException('You have reached the daily transformation limit for free accounts.',
          HttpStatus.FORBIDDEN
        )
      } 

      const transform = await sharp(filePath);

      if(width || height) {
        transform.resize(parseInt(width) || null, parseInt(height) || null)
      }
      
      if(format) {
        format.toLowerCase();
        if(['jpeg','webp', 'png'].includes(format)) {
          transform.toFormat(format as keyof sharp.FormatEnum)
          res.setHeader('Content-Type', `image/${format}`);
        } else {
          throw new HttpException('Unsupported format', HttpStatus.BAD_REQUEST);
        }
      } else {
        res.setHeader('Content-Type', 'image/jpeg');
      } 

      await this.usersService.updateUserUploadOrTransform('transform', user, 1)

      const buffer = await transform.toBuffer();
      
      await this.imageVersionsService.createImageVersion(image.id, filePath ,newFileName)
      await this.cacheManager.set(cacheKey, buffer, 1800); 

      return res.end(buffer);

  } 


  async getUserImages(id: number): Promise<Image[]> {
    const cacheKey = `user-images-${id}`;
    const cacheData: Image[] = await this.cacheManager.get(cacheKey)

    if(cacheData) {
      return cacheData;
    }

    const images =  await this.prisma.image.findMany({
      where: { ownerId: id },
      include: {
       tags: true,
       categoryes: true
      }
    })

    await this.cacheManager.set(cacheKey, images, 1800)
    return images;
  }

  async searchImages(query: string): Promise<Image[]> {

    const cacheKey = `cache-key-${query}`;
    const cacheData: Image[] = await this.cacheManager.get(cacheKey);

    if(cacheData) {
      return cacheData;
    }

    const images = await this.prisma.image.findMany({
      where: {
        OR: [
          {
            tags: {
              some: {
                name: {
                  contains: query
                }
              }
            }
          },
          {
            categoryes: {
              some: {
                name: {
                  contains: query
                }
              }
            }
          }
        ]
      },
      include: {
        tags: true,
        categoryes: true
      }
    })

    await this.cacheManager.set(cacheKey, images, 1800);

    return images;
  }

  async updateImageData(imageId: number, version: ImageVersion): Promise<Image> {
    return await this.prisma.image.update({
      where: {id: imageId},
      data: {
        fileName: version.fileName,
        path: version.path
      }
    })
  }

}
