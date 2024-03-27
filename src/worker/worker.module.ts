import { Module } from "@nestjs/common";
import { WorkerService } from "@/worker/worker.service";
import { EmailProcesstor } from "@/worker/processor/email.processtor";
import { MailModule } from "@/mail/mail.module";

@Module({
  imports: [MailModule],
  providers: [WorkerService, EmailProcesstor],
})
export class WorkerModule {}
