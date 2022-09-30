import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from '../users/users.service';
import { LoginUserPayload } from './dto/login-user.payload';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
    private jwtService: JwtService) { }

  async validateUser (email: string, pass: string): Promise<any> {
    const user = await this.usersService.getFromEmail(email);

    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login (user: User) {
    const payload = { role: user.role, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}