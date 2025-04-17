import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CategorysService } from './categorys.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('categorys')
@UseGuards(JwtAuthGuard) 
export class CategorysController {
  constructor(private readonly categorysService: CategorysService) {}


  @Post()
  create(@Body() dto: CreateCategoryDto ): Promise<Category> {
    return this.categorysService.create(dto)
  }
}
