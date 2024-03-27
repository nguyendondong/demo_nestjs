import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "@/database/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { InjectQueue } from "@nestjs/bull";
import { QueuesName } from "@/worker/queues";
import { Queue } from "bull";
import { I18nService } from "nestjs-i18n";

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(QueuesName.email) private emailQueue: Queue,
    private mailerService: MailerService,
    private configService: ConfigService,
    private readonly i18n: I18nService
  ) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `example.com/auth/confirm?token=${token}${user.id}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: `"Support Team" <${this.configService.get<string>("MAIL_SUPPORT_TEAM")}>`, // override default from
      subject: "Welcome to Nice App! Confirm your Email",
      template: "confirmation",
      context: {
        name: user.name,
        url,
      },
    });
  }

  async sendEmailEventUseMultiple(users: User[], eventURL: string) {
    return this.emailQueue.add({ users, eventURL });
  }

  async sendEmailEvent(user: User, eventURL: string) {
    await this.mailerService.sendMail({
      to: user.email,
      from: `"Support Team" <${this.configService.get<string>("MAIL_SUPPORT_TEAM")}>`, // override default from
      subject: "Welcome to Nice App! It's event time!",
      template: "evention",
      context: {
        hello: this.i18n.translate("mail.hello", {
          lang: "en",
          args: { name: `${user.name}` },
        }),
        inviteDescription: this.i18n.translate("mail.inviteDescription", {
          lang: "en",
        }),
        confirm: this.i18n.translate("mail.confirm", {
          lang: "en",
        }),
        signature: this.i18n.translate("mail.signature", {
          lang: "en",
        }),
        eventGift: this.i18n.translate("mail.eventGift", {
          lang: "en",
        }),
        eventURL,
      },
    });
  }
}
