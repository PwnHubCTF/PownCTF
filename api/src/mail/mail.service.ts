import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { ConfigsService } from 'src/configs/configs.service';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService, private configService: ConfigsService){

    }

    async sendTest(){
        const nameCtf = await this.configService.getValueFromKey('ctf.event_name')
        try {
            const mail = await this.mailerService.sendMail(
                {
                    to: 'yohan.g99@gmail.com', // list of receivers
                    from: `"${nameCtf}" <noreply@${nameCtf}.com>`, // sender address
                    subject: 'Testing Nest MailerModule ✔', // Subject line
                    text: 'welcome', // plaintext body
                    html: '<b>welcome</b>', // HTML body content
                  }
            )
            return mail
        } catch (error) {
            throw new ForbiddenException('Mail server is not configured')
        }
    }
}
