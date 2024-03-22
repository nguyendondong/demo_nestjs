import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "@/database/entities/user.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService
  ) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

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
}
