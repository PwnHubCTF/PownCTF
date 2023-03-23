import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigsService } from 'src/configs/configs.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
    private readonly logger = new Logger("MailService");
    constructor(private readonly mailerService: MailerService, private configService: ConfigsService) { }


    async sendWelcome (user: User) {
        const nameCtf = await this.configService.getValueFromKey('ctf.event_name')
        try {
            const mail = await this.mailerService.sendMail(
                {
                    to: user.email,
                    from: `"${nameCtf}" <noreply@${nameCtf}.com>`,
                    subject: `Registered on ${nameCtf}`,
                    template: 'welcome',
                    context: {
                        name: user.pseudo,
                        ctf: nameCtf,
                    },
                }
            )
            return mail
        } catch (error) {
            this.logger.error(error);
        }
    }
}
