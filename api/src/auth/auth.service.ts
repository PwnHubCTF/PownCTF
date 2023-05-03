import { ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserPayload } from './dto/create-user.payload';
import { LoginUserPayload } from './dto/login-user.payload';
import { ResetToken } from './reset-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(ResetToken) protected readonly tokenRepository: Repository<ResetToken>,
    private usersService: UsersService,
    private jwtService: JwtService, private readonly mailService: MailService
  ) { }


  async login(payload: LoginUserPayload) {
    if (!payload.email || !payload.password) throw new UnprocessableEntityException('Missing fields')
    const hashed = require('crypto').createHash('sha256').update(payload.password, 'utf8').digest('hex');
    const user = await this.usersService.getFromEmail(payload.email)
    if (!user) throw new ForbiddenException("User not found / Incorrect password");
    if (user.password !== hashed) throw new ForbiddenException("User not found / Incorrect password");
    return this.getToken(user);
  }

  async logout(user: User) {
    return true
  }

  async register(payload: CreateUserPayload) {
    if (!payload.email || !payload.password || !payload.pseudo) throw new UnprocessableEntityException('Missing fields')

    const user = await this.usersService.create(payload);
    return this.getToken(user);
  }

  getToken(user: User) {
    const payload = { role: user.role, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: "2 days" }),
    };
  }

  async resetPassword(token: string, password: string) {
    const resetToken = await this.tokenRepository.findOne({
      where: {
        token
      }, relations: ['user']
    })
    if (!resetToken) throw new ForbiddenException(`Invalid token`)
    const user = await this.usersService.changePassword(resetToken.user, password);
    await resetToken.remove()
    return this.getToken(user);
  }

  async getResetTokenInfos(token: string) {
    const resetToken = await this.tokenRepository.findOneBy({
      token
    })
    if (!resetToken) throw new ForbiddenException(`Invalid token`)
    return true
  }

  async generateResetToken(email) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new ForbiddenException(`Mail not found`)
    const token = await this.tokenRepository.save({
      token: generateStr(150),
      user: user
    })
    return token
  }

  async getUserFromToken(token: string) {
    let user = this.jwtService.verify(token)
    return await this.usersService.get(user.sub)
  }
}

function generateStr(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}