import { getRepository, In, Repository, SelectQueryBuilder } from 'typeorm';
import { addYears, subYears } from 'date-fns';

import { isEmpty } from '@utils/util';
import { FoodLogEntity } from '@entity/food-logs.entity';
import { FoodLog, FoodLogFindRequest } from '@interfaces/food-logs.interface';
import { UserEntity } from '@entity/users.entity';
import { CreateFoodLogDto, UpdateFoodLogDto } from '@dtos/food-logs.dto';
import { ProductEntity } from '@entity/products.entity';
import { IngredientEntity } from '@entity/ingredients.entity';
import { PaginateResponse } from '@interfaces/internal/response.interface';

import { checkIfConflict } from './common.service';
import { formatDate } from './internal/get-params-builder';

class GetFoodLogQueryBuilder {
  protected query: SelectQueryBuilder<FoodLogEntity>;

  protected limit: number;

  protected start: number;

  constructor(repository: Repository<FoodLogEntity>) {
    this.query = repository
      .createQueryBuilder('foodLog')
      .leftJoinAndSelect('foodLog.products', 'product')
      .leftJoinAndSelect('foodLog.ingredients', 'ingredient');
  }

  build(request: FoodLogFindRequest): void {
    this.addUser(request);
    this.addDate(request);
    this.savePagination(request);
    this.addSelect();
    this.orderByDate();
  }

  get(): SelectQueryBuilder<FoodLogEntity> {
    return this.query.take(this.limit).skip(this.start);
  }

  getTotal(): SelectQueryBuilder<FoodLogEntity> {
    return this.query;
  }

  protected addUser({ userId }: FoodLogFindRequest): void {
    if (isEmpty(userId)) return;
    this.query = this.query.andWhere('foodLog.userId = :userId', { userId });
  }

  protected addDate({ startDate, endDate }: FoodLogFindRequest): void {
    let startDateInput = startDate;
    let endDateInput = endDate;
    if (isEmpty(startDate) && isEmpty(endDate)) {
      return;
    }
    if (!isEmpty(startDate)) {
      endDateInput = addYears(startDate, 100);
    } else if (!isEmpty(endDate)) {
      startDateInput = subYears(endDate, 100);
    }
    this.query = this.query.andWhere(
      'foodLog.date BETWEEN :startDate AND :endDate',
      {
        startDate: formatDate(startDateInput),
        endDate: formatDate(endDateInput),
      },
    );
  }

  protected savePagination({ limit, start }: FoodLogFindRequest): void {
    this.limit = limit;
    this.start = start;
  }

  protected addSelect(): void {
    this.query = this.query.select([
      'foodLog.id',
      'foodLog.date',
      'product.id',
      'product.name',
      'product.barcode',
      'ingredient.id',
      'ingredient.name',
    ]);
  }

  protected orderByDate(): void {
    this.query = this.query.orderBy('foodLog.date', 'DESC');
  }
}

export class FoodLogsService {
  public foodLogs = FoodLogEntity;

  public users = UserEntity;

  public products = ProductEntity;

  public ingredients = IngredientEntity;

  public async getUserFoodLogs(
    req: FoodLogFindRequest,
  ): Promise<PaginateResponse<FoodLog>> {
    const foodLogsRepository = getRepository(this.foodLogs);
    const queryBuilder = new GetFoodLogQueryBuilder(foodLogsRepository);
    queryBuilder.build(req);
    const data = await queryBuilder.get().getMany();
    const total = await queryBuilder.getTotal().getCount();
    return { data, total };
  }

  public async createUserFoodLogs(
    userId: number,
    foodLog: CreateFoodLogDto,
  ): Promise<FoodLogEntity> {
    checkIfConflict(isEmpty(foodLog) || isEmpty(userId));
    const foodLogsRepository = getRepository(this.foodLogs);
    const foodLogEntity = await this.getFoodLogEntityFromCreateDto(foodLog);
    const usersRepository = getRepository(this.users);
    const user = await usersRepository.findOne({ where: { id: userId } });
    foodLogEntity.user = user;

    return foodLogsRepository.save(foodLogEntity);
  }

  public async updateUserFoodLogs(
    userId: number,
    foodLog: UpdateFoodLogDto,
  ): Promise<void> {
    checkIfConflict(isEmpty(foodLog) || isEmpty(userId));
    const foodLogsRepository = getRepository(this.foodLogs);
    const foodLogEntity = await foodLogsRepository.findOne({
      where: { id: foodLog.id, userId },
    });
    checkIfConflict(!foodLogEntity);
    const foodLogEntityCreated = await this.getFoodLogEntityFromCreateDto(
      foodLog,
    );
    foodLogEntity.ingredients = foodLogEntityCreated.ingredients;
    foodLogEntity.products = foodLogEntityCreated.products;
    await foodLogsRepository.save(foodLogEntity);
  }

  public async deleteFoodLogById(
    userId: number,
    foodLogId: number,
  ): Promise<void> {
    checkIfConflict(isEmpty(foodLogId) || isEmpty(userId));

    const foodLogsRepository = getRepository(this.foodLogs);
    const foodLog = await foodLogsRepository.findOne({
      where: { id: foodLogId, userId },
    });
    checkIfConflict(!foodLog);

    await foodLogsRepository.delete(foodLogId);
  }

  public async getFoodLogById(foodLogId: number): Promise<FoodLogEntity> {
    checkIfConflict(isEmpty(foodLogId));
    const foodLogsRepository = getRepository(this.foodLogs);
    return foodLogsRepository.findOne({ where: { id: foodLogId } });
  }

  protected async getFoodLogEntityFromCreateDto(
    foodLogData: CreateFoodLogDto,
  ): Promise<FoodLogEntity> {
    const foodLogEntity = new FoodLogEntity();
    foodLogEntity.date = new Date(foodLogData.date);
    if (foodLogData.products) {
      const products = await getRepository(this.products).find({
        where: { id: In(foodLogData.products) },
      });
      checkIfConflict(products.length !== foodLogData.products.length);
      foodLogEntity.products = products;
    }

    if (foodLogData.ingredients) {
      const ingredients = await getRepository(this.ingredients).find({
        where: { id: In(foodLogData.ingredients) },
      });
      checkIfConflict(ingredients.length !== foodLogData.ingredients.length);
      foodLogEntity.ingredients = ingredients;
    }

    return foodLogEntity;
  }
}

export default FoodLogsService;
