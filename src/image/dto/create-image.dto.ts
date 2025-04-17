import { IsNotEmpty, IsOptional, isArray, IsArray, IsString } from 'class-validator';
export class CreateImageDto {

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    tags?: string[];

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    categories?: string[]

    @IsNotEmpty()
    @IsString()
    userId: string
}
