import { Body, Controller, Post } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Tag } from '@prisma/client';
import { CreateTagsDto } from './dto/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() dto: CreateTagsDto): Promise<Tag> {
    return this.tagsService.create(dto)
  }
}
