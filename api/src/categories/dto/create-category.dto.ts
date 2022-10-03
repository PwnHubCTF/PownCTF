import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    name: string;
    
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    description: string;
}
