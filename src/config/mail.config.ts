import { join } from "path";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { ConfigService } from "@nestjs/config";
import { MailerOptions } from "@nestjs-modules/mailer";

const configService = new ConfigService();
export const mailConfig: MailerOptions = {
  transport: {
    host: configService.get<string>("MAIL_HOST"),
    port: configService.get<number>("MAIL_PORT"),
    secure: true,
    ignoreTLS: true,
    auth: {
      user: configService.get<string>("MAIL_USER"),
      pass: configService.get<string>("MAIL_PASSWORD"),
    },
  },
  defaults: {
    from: `"No Reply" <${configService.get<string>("MAIL_FROM")}>`,
  },
  template: {
    dir: join(__dirname, "../mail/templates/"),
    adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
    options: {
      strict: true,
    },
  },
};
