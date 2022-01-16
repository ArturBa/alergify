import { PaginateResponse } from '@interfaces/internal/response.interface';
import { Food, FoodGetRequest } from '@interfaces/foods.interface';
import { ProductGetRequest } from '@interfaces/products.interface';
import { ProductsService } from './products.service';
import { IngredientsService } from './ingredients.service';

class FoodsService {
  readonly productService = new ProductsService();

  readonly ingredientService = new IngredientsService();

  async findFood(
    req: FoodGetRequest,
  ): Promise<PaginateResponse<Partial<Food>>> {
    const ingredients = await this.ingredientService.find(req);
    const totalIngredients = await this.ingredientService.count(req);

    const productsRequest: ProductGetRequest = {
      ...req,
      start:
        req.start - totalIngredients < 0 ? 0 : req.start - totalIngredients,
      limit:
        req.limit - ingredients.length < 0 ? 0 : req.limit - ingredients.length,
    } as ProductGetRequest;

    const products =
      productsRequest.limit === 0
        ? []
        : await this.productService.find(productsRequest);
    const totalProducts = await this.productService.count(productsRequest);

    return {
      data: [
        ...ingredients.map(
          (ingredient): Partial<Food> => ({
            ...ingredient,
            type: 'ingredient',
          }),
        ),
        ...products.map(
          (product): Partial<Food> => ({
            ...product,
            type: 'product',
          }),
        ),
      ],
      total: totalIngredients + totalProducts,
    };
  }
}

export default FoodsService;
