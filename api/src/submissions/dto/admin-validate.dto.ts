import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AdminValidateDto {
    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    challengeId: string;

    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    userId: string;
}
