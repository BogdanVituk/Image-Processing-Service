import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Get(':id')
  getUserByid(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(+id)
  }
}
