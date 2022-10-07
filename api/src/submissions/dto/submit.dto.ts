import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SubmitDto {
    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    challengeId: string;

    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    flag: string;
}
