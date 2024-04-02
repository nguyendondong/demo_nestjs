import { Process, Processor } from "@nestjs/bull";
import { QueuesName } from "@/api/base";
import { MailService } from "@/mail/mail.service";

@Processor(QueuesName.email)
export class EmailProcesstor {
  constructor(private readonly emailService: MailService) {}

  @Process("event")
  async sendEmailEvent(job: any) {
    const { users, eventURL } = job.data;
    await Promise.all(
      (users || []).map((user) =>
        this.emailService.sendEmailEvent(user, eventURL)
      )
    );
  }

  @Process("confirmation")
  async sendEmailConfirmation(job: any) {
    const { lang, user, token } = job.data;

    await this.emailService.sendUserConfirmation(lang, user, token);
  }

  @Process("resetPassword")
  async sendEmailResetPassword(job: any) {
    const { lang, user, token } = job.data;

    await this.emailService.sendEmailResetPassword(lang, user, token);
  }
}
