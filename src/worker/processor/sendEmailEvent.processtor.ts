import { Process, Processor } from "@nestjs/bull";
import { QueuesName } from "@/worker/queues";
import { MailService } from "@/mail/mail.service";

@Processor(QueuesName.email)
export class SendEmailEventProcesstor {
  constructor(private readonly emailService: MailService) {}

  @Process()
  async sendEmail(job: any) {
    const { users, eventURL } = job.data;
    await Promise.all(
      (users || []).map((user) =>
        this.emailService.sendEmailEvent(user, eventURL)
      )
    );
  }
}
