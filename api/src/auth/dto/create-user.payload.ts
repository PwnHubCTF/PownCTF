import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserPayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  pseudo: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  email: string;
}
