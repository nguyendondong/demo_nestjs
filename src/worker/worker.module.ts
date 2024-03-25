import { Module } from "@nestjs/common";
import { WorkerService } from "@/worker/worker.service";
import { SendEmailEventProcesstor } from "@/worker/processor/sendEmailEvent.processtor";
import { MailModule } from "@/mail/mail.module";

@Module({
  imports: [MailModule],
  providers: [WorkerService, SendEmailEventProcesstor],
})
export class WorkerModule {}
