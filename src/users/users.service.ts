import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async getUserById(id: number): Promise<User> {
        return await this.prisma.user.findUnique({where: {id}})
    }

    async updateUserUploadOrTransform(value: string ,user: User, count: number): Promise<User> {

        if(value == 'upload') {
            return await this.prisma.user.update({
                where: {id: user.id},
                data: {
                    uploatedImage: user.uploatedImage + count
                }
            })
        } else if(value == 'transform') {
            return await this.prisma.user.update({
                where: {id: user.id},
                data: {
                    transformedImage: user.transformedImage + count
                }
            })
        }
    }

    async getUserByEmail(email: string): Promise<User> {
        return await this.prisma.user.findUnique({where: {email}})
    }
}
