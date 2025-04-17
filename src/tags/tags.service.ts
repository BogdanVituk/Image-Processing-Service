import { Injectable } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateTagsDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateTagsDto): Promise<Tag> {
        return await this.prisma.tag.create({data: dto})
    }
}
