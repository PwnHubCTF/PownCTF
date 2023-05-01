import { ApiProperty } from '@nestjs/swagger';

export class UpdateTeamDto {
    @ApiProperty({
        required: false,
    })
    open: boolean;
    @ApiProperty({
        required: false,
    })
    name: string;
}
