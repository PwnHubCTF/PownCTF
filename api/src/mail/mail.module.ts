import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigsModule } from 'src/configs/configs.module';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: process.env.MAIL_TRANSPORT,
    }),
    ConfigsModule
  ],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule { }
