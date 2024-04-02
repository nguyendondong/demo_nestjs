import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { mailConfig } from "@/config/mail.config";
import { BullModule } from "@nestjs/bull";
import { QueuesName } from "src/api/base";

@Module({
  imports: [
    MailerModule.forRoot(mailConfig),
    BullModule.registerQueue({
      name: QueuesName.email,
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
