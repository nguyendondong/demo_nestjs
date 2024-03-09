import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager, EntityTarget, FindOneOptions } from "typeorm";

@Injectable()
export class BaseService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager
  ) {}

  async findOne<T>(
    entity: EntityTarget<T>,
    options: FindOneOptions<T>
  ): Promise<T> {
    return this.entityManager.findOne(entity, options);
  }
}
