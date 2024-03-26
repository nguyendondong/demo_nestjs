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

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async sendEventEmail() {
    console.log("sendEventEmail running...");
    const users = await this.entityManager.find(User);
    return this.mailService.sendEmailEventUseMultiple(
      users,
      "https://example.com"
    );
  }
}
