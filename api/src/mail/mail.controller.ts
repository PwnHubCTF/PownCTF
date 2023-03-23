import { Controller } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';

@Controller('mail')
@ApiTags('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test')
  forUser () {
    return this.mailService.sendTest();
  }
}
