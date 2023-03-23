import { ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserPayload } from './dto/create-user.payload';
import { LoginUserPayload } from './dto/login-user.payload';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
    private jwtService: JwtService, private readonly mailService: MailService,) { }


  async login (payload: LoginUserPayload) {
    if (!payload.email || !payload.password) throw new UnprocessableEntityException('Missing fields')
    const hashed = require('crypto').createHash('sha256').update(payload.password, 'utf8').digest('hex');
    const user = await this.usersService.getFromEmail(payload.email)
    if (!user) throw new ForbiddenException("User not found / Incorrect password");
    if (user.password !== hashed) throw new ForbiddenException("User not found / Incorrect password");
    return this.getToken(user);
  }
  
  async register (payload: CreateUserPayload) {
    if (!payload.email || !payload.password || !payload.pseudo) throw new UnprocessableEntityException('Missing fields')
    
    const user = await this.usersService.create(payload);
    this.mailService.sendWelcome(user)
    return this.getToken(user);
  }

  getToken (user: User) {
    const payload = { role: user.role, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {expiresIn: "2 days"}),
    };
  }

  async getUserFromToken(token: string){
    let user = this.jwtService.verify(token)
    return await this.usersService.get(user.sub)
  }
}