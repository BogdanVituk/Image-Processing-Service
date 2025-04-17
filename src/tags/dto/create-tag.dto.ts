import { IsString } from "class-validator";

export class CreateTagsDto {
    @IsString()
    name: string
}