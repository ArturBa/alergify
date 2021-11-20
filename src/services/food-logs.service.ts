import { getRepository, In } from 'typeorm';
import { isEmpty } from '@utils/util';
import { FoodLogEntity } from '@entity/food-logs.entity';
import { FoodLog } from '@interfaces/food-logs.interface';
import { UserEntity } from '@entity/users.entity';
import { CreateFoodLogDto, UpdateFoodLogDto } from '@dtos/food-logs.dto';
import { ProductEntity } from '@entity/products.entity';
import { IngredientEntity } from '@entity/ingredients.entity';
import { checkIfConflict } from './common.service';
import { Paginate } from '@interfaces/internal/paginate.interface';

class FoodLogsService {
  public foodLogs = FoodLogEntity;
  public users = UserEntity;
  public products = ProductEntity;
  public ingredients = IngredientEntity;

  public async getUserFoodLogs(userId: number): Promise<Paginate<FoodLog>> {
    const foodLogsRepository = getRepository(this.foodLogs);
    const data = await foodLogsRepository
      .createQueryBuilder('foodLog')
      .where('foodLog.userId = :userId', { userId })
      .leftJoinAndSelect('foodLog.products', 'product')
      .leftJoinAndSelect('foodLog.ingredients', 'ingredient')
      .select([
        'foodLog.id',
        'foodLog.date',
        'product.id',
        'product.name',
        'product.barcode',
        'ingredient.id',
        'ingredient.name',
      ])
      .getMany();
    const total = await foodLogsRepository.count({ where: { userId } });

    return { data, total };
  }

  public async createUserFoodLogs(
    userId: number,
    foodLog: CreateFoodLogDto,
  ): Promise<void> {
    checkIfConflict(isEmpty(foodLog) || isEmpty(userId));
    const foodLogsRepository = getRepository(this.foodLogs);
    const foodLogEntity = await this.getFoodLogEntityFromCreateDto(foodLog);
    const usersRepository = getRepository(this.users);
    const user = await usersRepository.findOne({ where: { id: userId } });
    foodLogEntity.user = user;

    await foodLogsRepository.save(foodLogEntity);
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

  public async findUserFoodLogById(
    userId: number,
    foodLogId: number,
  ): Promise<FoodLog> {
    checkIfConflict(isEmpty(foodLogId) || isEmpty(userId));

    const foodLogsRepository = getRepository(this.foodLogs);
    const foodLog = await foodLogsRepository.findOne({
      where: { id: foodLogId, userId },
    });
    checkIfConflict(!foodLog);

    return foodLog;
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

  protected async getFoodLogEntityFromCreateDto(
    foodLogData: CreateFoodLogDto,
  ): Promise<FoodLogEntity> {
    const foodLogEntity = new FoodLogEntity();
    foodLogEntity.date = new Date(foodLogData.date);
    const products = await getRepository(this.products).find({
      where: { id: In(foodLogData.products) },
    });
    const ingredients = await getRepository(this.ingredients).find({
      where: { id: In(foodLogData.ingredients) },
    });
    checkIfConflict(
      products.length !== foodLogData.products.length ||
        ingredients.length !== foodLogData.ingredients.length,
    );
    foodLogEntity.products = products;
    foodLogEntity.ingredients = ingredients;

    return foodLogEntity;
  }
}

export default FoodLogsService;
