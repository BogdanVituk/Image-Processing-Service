import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth-dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private jwtService: JwtService,
        private userService: UsersService
    ) {}

    async login(dto: AuthDto): Promise<{acces_token: string}> {
        const user = await this.userService.getUserByEmail(dto.email)

        if(!user) throw new BadRequestException('Не вірний пароль чи емеіл')

        const isValidPassword = await bcrypt.compare(dto.password, user.password);

        if(!isValidPassword) throw new BadRequestException('Не вірний пароль чи емеіл')

        
        return this.generateToken(user.email, user.id)
    }
    
    async register(dto: AuthDto): Promise<{acces_token: string}> {
        const userExist = await this.userService.getUserByEmail(dto.email)

        if(userExist) throw new BadRequestException('Користувач вже існує')

        const hashPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashPassword
            }
        })

        return this.generateToken(user.email, user.id)
    }

    private generateToken(email: string, id: number): {acces_token: string} {
        const payload = {sub: email, id}

        return {
            acces_token: this.jwtService.sign(payload)
        }

    }
}
