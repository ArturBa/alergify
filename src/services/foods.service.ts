import { Food, FoodGetRequest } from '@interfaces/foods.interface';
import { ProductGetRequest } from '@interfaces/products.interface';
import { ProductsService } from './products.service';
import { IngredientsService } from './ingredients.service';

class FoodsService {
  readonly productService = new ProductsService();

  readonly ingredientService = new IngredientsService();

  async find(req: FoodGetRequest): Promise<Partial<Food>[]> {
    const ingredients = req.name ? await this.ingredientService.find(req) : [];
    const totalIngredients = req.name
      ? await this.ingredientService.count(req)
      : 0;

    const productsRequest: ProductGetRequest = {
      ...req,
      start:
        req.start - totalIngredients < 0 ? 0 : req.start - totalIngredients,
      limit:
        req.limit - ingredients.length < 0 ? 0 : req.limit - ingredients.length,
    } as unknown as ProductGetRequest;

    const products =
      productsRequest.limit === 0
        ? []
        : await this.productService.find(productsRequest);

    return [
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
    ];
  }

  async count(req: FoodGetRequest): Promise<number> {
    return Promise.all([
      this.ingredientService.count(req),
      this.productService.count(req),
    ]).then(counts => counts.reduce((a, b) => a + b, 0));
  }
}

export default FoodsService;
