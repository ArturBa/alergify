import { EntityTarget, getRepository, Repository } from 'typeorm';

import { BaseEntity } from '@entity/base.entity';

export interface QueryBuilderMockParams {
  getMany: any[];
  getOne?: any;
}

export function createQueryBuilderMock(
  { getMany, getOne }: QueryBuilderMockParams = {
    getMany: [],
    getOne: null,
  },
): jest.Mock<any> {
  const getOneResp = getOne || getMany[0];

  return jest.fn().mockReturnValue({
    andWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnValue(
      Promise.resolve(
        getMany.map(a => {
          return {
            ...a,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }),
      ),
    ),
    getCount: jest.fn().mockReturnValue(Promise.resolve(getMany.length)),
    getOne: jest.fn().mockReturnValue(Promise.resolve(getOneResp)),
  });
}

export function repositoryMock(
  entity: EntityTarget<BaseEntity>,
  { getMany, getOne }: QueryBuilderMockParams = {
    getMany: [],
    getOne: null,
  },
): Repository<BaseEntity> {
  const getOneResp = getOne || getMany[0];
  const repository = getRepository(entity);

  repository.save = jest.fn().mockResolvedValue(getOneResp);
  repository.delete = jest.fn().mockResolvedValue(getOneResp);
  repository.remove = jest.fn().mockResolvedValue(getOneResp);
  repository.createQueryBuilder = createQueryBuilderMock({
    getMany,
    getOne,
  });
  return repository;
}
