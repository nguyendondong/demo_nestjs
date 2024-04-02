import { Module } from "@nestjs/common";
import { WorkerService } from "@/api/v1/worker/worker.service";
import { EmailProcesstor } from "@/processor/email.processtor";
import { MailModule } from "@/mail/mail.module";

@Module({
  imports: [MailModule],
  providers: [WorkerService, EmailProcesstor],
})
export class WorkerModule {}
