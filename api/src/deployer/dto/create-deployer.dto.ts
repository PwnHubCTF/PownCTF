import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateDeployerDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    url: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    token: string;
}
