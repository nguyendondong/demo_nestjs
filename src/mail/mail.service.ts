import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "@/database/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { InjectQueue } from "@nestjs/bull";
import { QueuesName } from "src/api/base";
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

  async sendEmailConfirmation(lang: string, user: User, token: string) {
    return this.emailQueue.add("confirmation", { lang, user, token });
  }

  async sendResetPassword(lang: string, user: User, token: string) {
    return this.emailQueue.add("resetPassword", { lang, user, token });
  }

  async sendEmailEventUseMultiple(users: User[], eventURL: string) {
    return this.emailQueue.add("event", { users, eventURL });
  }

  async sendUserConfirmation(lang: string, user: User, token: string) {
    const url = `${this.configService.get<string>("FRONTEND_URL")}/auth/confirm-email/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: `"Support Team" <${this.configService.get<string>("MAIL_SUPPORT_TEAM")}>`, // override default from
      subject: this.i18n.translate("mail.confirmation.subject", {
        lang,
      }),
      template: "confirmation",
      context: {
        hello: this.i18n.translate("mail.hello", {
          lang,
          args: { name: `${user.name}` },
        }),
        confirmationDescription: this.i18n.translate(
          "mail.confirmation.confirmationDescription",
          {
            lang,
          }
        ),
        ignoreDescription: this.i18n.translate(
          "mail.confirmation.ignoreDescription",
          {
            lang,
          }
        ),
        confirm: this.i18n.translate("mail.confirmation.confirm", {
          lang,
        }),
        url,
      },
    });
  }

  async sendEmailEvent(user: User, eventURL: string) {
    await this.mailerService.sendMail({
      to: user.email,
      from: `"Support Team" <${this.configService.get<string>("MAIL_SUPPORT_TEAM")}>`, // override default from
      subject: this.i18n.translate("mail.event.subject", {
        lang: "en",
      }),
      template: "evention",
      context: {
        hello: this.i18n.translate("mail.hello", {
          lang: "en",
          args: { name: `${user.name}` },
        }),
        inviteDescription: this.i18n.translate("mail.event.inviteDescription", {
          lang: "en",
        }),
        confirm: this.i18n.translate("mail.event.confirm", {
          lang: "en",
        }),
        signature: this.i18n.translate("mail.event.signature", {
          lang: "en",
        }),
        eventGift: this.i18n.translate("mail.event.eventGift", {
          lang: "en",
        }),
        eventURL,
      },
    });
  }

  async sendEmailResetPassword(lang: string, user: User, token: string) {
    const url = `${this.configService.get<string>("FRONTEND_URL")}/api/v1/auth/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      from: `"Support Team" <${this.configService.get<string>("MAIL_SUPPORT_TEAM")}>`, // override default from
      subject: this.i18n.translate("mail.resetPassword.subject", {
        lang,
      }),
      template: "resetPassword",
      context: {
        hello: this.i18n.translate("mail.hello", {
          lang,
          args: { name: `${user.name}` },
        }),
        resetDescription: this.i18n.translate(
          "mail.resetPassword.resetDescription",
          {
            lang,
          }
        ),
        confirm: this.i18n.translate("mail.resetPassword.confirm", {
          lang,
        }),
        url,
      },
    });
  }
}
