import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserPayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  pseudo: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  email: string;
}
