import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager, EntityTarget, Like } from "typeorm";
import { responsePagination } from "@/base/dto/pagination.dto";
import { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder";
import { responseUserDto } from "@/users/dto/create-user.dto";
import { transformDataEnitity } from "@/utils/TransformDataUtils";
import { SearchDto } from "@/users/dto/search.dto";

@Injectable()
export class BaseService<Entity> {
  constructor(
    @InjectEntityManager() protected readonly entityManager: EntityManager
  ) {}

  async FindWithPagination(
    entity: EntityTarget<Entity>,
    searchDto: SearchDto
  ): Promise<responsePagination> {
    const options: FindOptionsOrder<any> = {
      email: "ASC",
      createdAt: "DESC",
    };
    const page = Number(searchDto.page) || 1;
    const limit = Number(searchDto.limit) || 10;

    const [entities, count] = await this.entityManager.findAndCount(entity, {
      where: [
        {
          name: Like("%" + searchDto.name + "%"),
          email: Like("%" + searchDto.email + "%"),
        },
      ],
      skip: (page - 1) * limit,
      take: limit || 10,
      order: options,
    });

    const lastPage = Math.ceil(count / limit);
    const nextPage = page + 1 > lastPage ? undefined : page + 1;
    const prevPage = page - 1 < 1 ? undefined : page - 1;

    return {
      data: transformDataEnitity(responseUserDto, entities),
      count,
      lastPage,
      nextPage,
      prevPage,
    };
  }
}
