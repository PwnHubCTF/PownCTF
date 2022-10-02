import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateConfigDto {
    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    value: string;
}
