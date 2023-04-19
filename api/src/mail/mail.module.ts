import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import * as path from 'path';
import { ConfigsModule } from 'src/configs/configs.module';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: `smtps://${process.env.SMTP_EMAIL}:${process.env.SMTP_PASSWORD}@${process.env.SMTP_DOMAIN}`,
      template: {
        dir: path.join(__dirname, '/../../mail_templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ConfigsModule
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule { }
