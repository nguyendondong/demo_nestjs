import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";

import { EntityManager, EntityTarget, FindManyOptions } from "typeorm";
import { PaginationDto } from "@/base/dto/pagination.dto";
import { FindOneOptions } from "typeorm/find-options/FindOneOptions";
import { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder";

@Injectable()
export class BaseService<Entity> {
  constructor(
    @InjectEntityManager() protected readonly entityManager: EntityManager
  ) {}

  async FindWithPagination(
    entity: EntityTarget<Entity>,
    paginationDto: PaginationDto
  ): Promise<any> {
    const options: FindOptionsOrder<any> = {
      email: "ASC",
      createdAt: "DESC",
    };
    const page = Number(paginationDto.page) || 1;
    const limit = Number(paginationDto.limit) || 10;
    const [entities, count] = await this.entityManager.findAndCount(entity, {
      skip: (page - 1) * limit,
      take: limit || 10,
      order: options,
    });

    const lastPage = Math.ceil(count / limit);
    const nextPage = page + 1 > lastPage ? undefined : page + 1;
    const prevPage = page - 1 < 1 ? undefined : page - 1;

    return {
      data: entities,
      count,
      lastPage,
      nextPage,
      prevPage,
    };
  }
}
