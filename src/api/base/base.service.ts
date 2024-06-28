import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager, EntityTarget, Like } from "typeorm";
import { responsePagination } from "@/api/base/dto/pagination.dto";
import { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder";
import { ResponseUserDto } from "@/api/v1/users/dto/create-user.dto";
import Helpers from "@/utils/TransformDataUtils";
import { SearchDto } from "@/api/v1/users/dto/search.dto";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@Injectable()
export class BaseService {
  constructor(
    @InjectEntityManager() protected readonly entityManager: EntityManager
  ) {}

  async FindWithPagination<Entity>(
    entity: EntityTarget<Entity>,
    searchDto: SearchDto
  ): Promise<responsePagination> {
    const options: FindOptionsOrder<any> = {
      email: "ASC",
      createdAt: "DESC",
    };
    const page = Number(searchDto.page) || 1;
    const limit = Number(searchDto.limit) || 10;
    const name = searchDto.name || "";
    const email = searchDto.email || "";

    const [entities, total] = await this.entityManager.findAndCount(entity, {
      where: [
        {
          name: Like("%" + name + "%"),
          email: Like("%" + email + "%"),
        },
      ],
      skip: (page - 1) * limit,
      take: limit || 10,
      order: options,
    });

    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? undefined : page + 1;
    const prevPage = page - 1 < 1 ? undefined : page - 1;
    const currentPage = page;
    const perPage = limit;

    return {
      data: Helpers.transformDataEnitity(ResponseUserDto, entities),
      total,
      currentPage,
      lastPage,
      nextPage,
      prevPage,
      perPage,
    };
  }

  async upsertMultiple<Entity>(
    entity: EntityTarget<Entity>,
    entities: QueryDeepPartialEntity<Entity>[],
    conflictPaths: string[]
  ) {
    await this.entityManager.upsert(entity, entities, {
      conflictPaths: conflictPaths,
      skipUpdateIfNoValuesChanged: true,
    });

    return true;
  }
}
