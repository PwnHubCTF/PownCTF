import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { ConfigsService } from 'src/configs/configs.service';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService, private configService: ConfigsService) {

    }

    async sendTest () {
        const nameCtf = await this.configService.getValueFromKey('ctf.event_name')
        try {
            const mail = await this.mailerService.sendMail(
                {
                    to: 'yohan.g99@gmail.com',
                    from: `"${nameCtf}" <noreply@${nameCtf}.com>`,
                    subject: `Welcome on ${nameCtf}`,
                    template: 'welcome',
                    context: {
                        name: 'NAME',
                        confirmation_url: "URL",
                    },
                }
            )
            return mail
        } catch (error) {
            console.log(error);

            throw new ForbiddenException('Mail server is not configured')
        }
    }
}
