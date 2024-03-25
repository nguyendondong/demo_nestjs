import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MailService } from "@/mail/mail.service";
import { EntityManager } from "typeorm";
import { User } from "@/database/entities/user.entity";

@Injectable()
export class WorkerService {
  constructor(
    private readonly mailService: MailService,
    private readonly entityManager: EntityManager
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async sendEventEmail() {
    console.log("sendEventEmail running...");
    const users = await this.entityManager.find(User);
    return this.mailService.sendEmailEventUseMultiple(
      users,
      "https://example.com"
    );
  }
}
