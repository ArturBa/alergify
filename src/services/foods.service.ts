import { PaginateResponse } from '@interfaces/internal/response.interface';
import { Food, FoodGetRequest } from '@interfaces/foods.interface';
import { ProductGetRequest } from '@interfaces/products.interface';
import ProductsService from './products.service';
import IngredientsService from './ingredients.service';

class FoodsService {
  readonly productService = new ProductsService();

  readonly ingredientService = new IngredientsService();

  async findFood(
    req: FoodGetRequest,
  ): Promise<PaginateResponse<Partial<Food>>> {
    const ingredients = await this.ingredientService.findIngredients(req);

    const productsRequest: ProductGetRequest = {
      ...req,
      start:
        req.start - ingredients.total < 0 ? 0 : req.start - ingredients.total,
      limit:
        req.limit - ingredients.data.length < 0
          ? 0
          : req.limit - ingredients.data.length,
    } as ProductGetRequest;

    const products = await this.productService.findProduct(productsRequest);
    if (productsRequest.limit === 0) {
      products.data = [];
    }

    return {
      data: [
        ...ingredients.data.map(
          (ingredient): Partial<Food> => ({
            ...ingredient,
            type: 'ingredient',
          }),
        ),
        ...products.data.map(
          (product): Partial<Food> => ({
            ...product,
            type: 'product',
          }),
        ),
      ],
      total: ingredients.total + products.total,
    };
  }
}

export default FoodsService;
