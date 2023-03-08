import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    text: string;
}
