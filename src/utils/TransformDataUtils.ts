import { plainToInstance } from "class-transformer";

export const transformDataResponse = <T>(
  dtoClass: new () => T,
  data: Record<string, any>
): T => {
  return plainToInstance(dtoClass, data, {
    excludeExtraneousValues: true,
  });
};

export const transformDataEnitity = <T>(
  dtoClass: new () => T,
  data: Record<string, any>
): T => {
  return plainToInstance(dtoClass, data);
};
