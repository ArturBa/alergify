import { Response, NextFunction } from 'express';

import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import { IngredientsService } from '@services/ingredients.service';
import { ProductCreateDto } from '@dtos/products.dto';
import { ProductEntity } from '@entity/products.entity';
import { ProductGetRequest } from '@interfaces/products.interface';
import { ProductsService } from '@services/products.service';
import { RequestWithUser } from '@interfaces/internal/auth.interface';

import { ControllerOmitHelper } from './internal/omit-helper';

class ProductsController {
  public productService = new ProductsService();

  public ingredientsService = new IngredientsService();

  public get = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const productId = Number(req.params.id);
      const { userId } = req;
      const product = await this.productService
        .get({ userId, id: productId })
        .then(ControllerOmitHelper.omitCreatedUpdatedAt)
        .then(ControllerOmitHelper.omitUserId);
      res.status(HttpStatusCode.OK).json(product);
    } catch (error) {
      next(error);
    }
  };

  public createProduct = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const productData: ProductCreateDto = req.body;
      const { userId } = req;
      await this.productService.create({ ...productData, userId });

      res.sendStatus(HttpStatusCode.CREATED);
    } catch (error) {
      next(error);
    }
  };

  public findProduct = async (
    req: ProductGetRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const omitIngredients = (
        product: ProductEntity,
      ): Partial<ProductEntity> => {
        const productCopy = { ...product };
        delete productCopy.ingredients;
        return productCopy;
      };
      const omitIngredientsArray = (
        product: ProductEntity[],
      ): Partial<ProductEntity>[] => {
        return ControllerOmitHelper.omitArray(product, omitIngredients);
      };

      const data = await this.productService
        .find(req)
        .then(omitIngredientsArray)
        .then(ControllerOmitHelper.omitCreatedUpdatedAtArray)
        .then(ControllerOmitHelper.omitUserIdArray);
      const count = await this.productService.count(req);

      res.status(HttpStatusCode.OK).json({ data, count });
    } catch (error) {
      next(error);
    }
  };
}

export default ProductsController;
