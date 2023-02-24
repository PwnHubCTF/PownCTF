import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SubmitXssDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    payload: string;
}
