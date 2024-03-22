import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { mailConfig } from "@/config/mail.config";

@Module({
  imports: [MailerModule.forRoot(mailConfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
