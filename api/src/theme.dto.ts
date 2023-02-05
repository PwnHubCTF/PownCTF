import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ThemeDto {
    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    theme: string;
}
