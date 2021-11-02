import { getRepository } from 'typeorm';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { FoodLogEntity } from '@entity/food-logs.entity';
import { FoodLog } from '@interfaces/food-logs.interface';
import { UserEntity } from '@entity/users.entity';
import { CreateFoodLogDto } from '@dtos/food-logs.dto';
import { ProductEntity } from '@entity/products.entity';
import { IngredientEntity } from '@entity/ingredients.entity';
import HttpStatusCode from '@interfaces/http-codes.interface';
import { checkIfConflict } from './common.services';

class FoodLogsService {
  public foodLogs = FoodLogEntity;
  public users = UserEntity;
  public products = ProductEntity;
  public ingredients = IngredientEntity;

  public async getUserFoodLogs(userId: number): Promise<FoodLog[]> {
    const foodLogsRepository = getRepository(this.foodLogs);
    const foodLogs = await foodLogsRepository
      .createQueryBuilder('foodLog')
      .where('foodLog.userId = :userId', { userId })
      .leftJoinAndSelect('foodLog.products', 'product')
      .leftJoinAndSelect('foodLog.ingredients', 'ingredient')
      .select([
        'foodLog.id',
        'foodLog.date',
        'product.id',
        'product.name',
        'ingredient.id',
        'ingredient.name',
      ])
      .getMany();

    return foodLogs;
  }

  public async createUserFoodLogs(
    userId: number,
    foodLog: CreateFoodLogDto,
  ): Promise<void> {
    checkIfConflict(isEmpty(foodLog) || isEmpty(userId));
    const foodLogsRepository = getRepository(this.foodLogs);
    const usersRepository = getRepository(this.users);
    const user = await usersRepository.findOne({ where: { id: userId } });

    const foodLogEntity = new FoodLogEntity();
    foodLogEntity.user = user;
    foodLogEntity.date = new Date(foodLog.date);
    const products = await getRepository(this.products).find({
      where: { id: foodLog.products },
    });
    const ingredients = await getRepository(this.ingredients).find({
      where: { id: foodLog.ingredients },
    });
    if (isEmpty(products) && isEmpty(ingredients)) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        'No products or ingredients selected',
      );
    }
    foodLogEntity.products = products;
    foodLogEntity.ingredients = ingredients;
    await foodLogsRepository.save(foodLogEntity);
  }

  public async updateUserFoodLogs(
    userId: number,
    foodLog: Partial<FoodLog>,
  ): Promise<void> {
    checkIfConflict(isEmpty(foodLog) || isEmpty(userId));
    const foodLogsRepository = getRepository(this.foodLogs);
    const foodLogEntity = await foodLogsRepository.findOne({
      where: { id: foodLog.id },
    });
    checkIfConflict(foodLogEntity.user.id !== userId, 'User id does not match');
    await foodLogsRepository.update(foodLog.id, { ...foodLog });
  }

  public async findUserFoodLogById(
    userId: number,
    foodLogId: number,
  ): Promise<FoodLog> {
    checkIfConflict(isEmpty(foodLogId) || isEmpty(userId));

    const foodLogsRepository = getRepository(this.foodLogs);
    const foodLog = await foodLogsRepository.findOne({
      where: { id: foodLogId },
    });
    checkIfConflict(foodLog.user.id !== userId, 'User id does not match');

    return foodLog;
  }

  public async deleteFoodLogById(
    userId: number,
    foodLogId: number,
  ): Promise<void> {
    checkIfConflict(isEmpty(foodLogId) || isEmpty(userId));

    const foodLogsRepository = getRepository(this.foodLogs);
    const foodLog = await foodLogsRepository.findOne({
      where: { id: foodLogId },
    });
    checkIfConflict(foodLog.user.id !== userId);

    await foodLogsRepository.delete(foodLogId);
  }
}

export default FoodLogsService;
