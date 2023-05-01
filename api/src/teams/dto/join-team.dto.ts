import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class JoinTeamDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    name: string;
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    password: string;
}
