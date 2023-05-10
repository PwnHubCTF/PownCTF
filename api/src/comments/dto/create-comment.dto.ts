import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    text: string;
}
