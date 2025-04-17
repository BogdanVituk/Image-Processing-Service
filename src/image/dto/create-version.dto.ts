import {IsString } from "class-validator"

export class CreateVersionDto {
    @IsString()
    imageId: string

    @IsString()
    newPath: string

    @IsString()
    newFileName: string
}