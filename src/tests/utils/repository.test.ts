export interface QueryBuilderMockParams {
  getMany: any[];
}

export function createQueryBuilderMock(
  { getMany }: QueryBuilderMockParams = {
    getMany: [],
  },
): jest.Mock<any> {
  return jest.fn().mockReturnValue({
    andWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnValue(Promise.resolve(getMany)),
  });
}
