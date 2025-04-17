import { Controller, Get, Post, Body, Patch, Param, Delete, Put , Query, Res, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateImageDto } from './dto/create-image.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import type { Multer } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Image } from '@prisma/client';
import { existsSync, mkdirSync } from 'fs';

@Controller('image')

@UseGuards(JwtAuthGuard)
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(
          FileInterceptor('file', {
              storage: diskStorage({
                destination: (req, file, callback) => {
                  const uploadPath = './uploads';
          
                  if (!existsSync(uploadPath)) {
                    mkdirSync(uploadPath, { recursive: true });
                  }
          
                  callback(null, uploadPath);
                },
                  filename: (req, file, callback) => {
                      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                      const ext = extname(file.originalname);
                      callback(null, `${uniqueSuffix}${ext}`)
                  },
              }),
              limits: {fileSize: 5 * 1024 * 1024},
              fileFilter: (req, file, callback) => {
                  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                  if ( allowedTypes.includes(file.mimetype)) {
                      callback(null, true)
                  } else {
                      callback(new Error('Only image files are allowed'), false)
                  }
              }
          }),
      )
  async create(@UploadedFile() file: Multer.file, @Body() dto: CreateImageDto): Promise<Image> {
    return await this.imageService.upload(file, dto);
  }

  @Get('transform') 
  transform(
    @Query('filename') filename: string,
    @Query('width') width: string,
    @Query('height') height: string,
    @Query('format') format: string,
    @Res() res: Response
  ): Promise<Image> {
    return this.imageService.transform(filename, width, height, format, res)
  }

  @Get('getAll/:id')
  async getUserImages(@Param('id') id: string) {
    return await this.imageService.getUserImages(+id);
  }

  @Get('search') 
  async search(@Query('query') query: string ) {
    return await this.imageService.searchImages(query)
  }


}
