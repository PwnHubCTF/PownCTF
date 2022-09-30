import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Role } from 'src/auth/role.enum';


export class ChangeRolePayload {

  @ApiProperty({
    required: true,
    enum: Role
  })
  @IsNotEmpty()
  role: Role;
}
