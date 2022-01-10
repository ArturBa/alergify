import { Request, Response, NextFunction } from 'express';
import { CreateProductDto } from '@dtos/products.dto';
import HttpStatusCode from '@interfaces/internal/http-codes.interface';
import ProductsService from '@services/products.service';
import { ProductGetRequest } from '../interfaces/products.interface';
import { RequestWithUser } from '../interfaces/internal/auth.interface';

class ProductsController {
  public productService = new ProductsService();

  public getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const productId = Number(req.params.id);
      const product = await this.productService.getProductById(productId);

      res.status(HttpStatusCode.OK).json({ ...product });
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
      const productData: CreateProductDto = req.body;
      const { userId } = req;
      await this.productService.createProduct(userId, productData);

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
      const response = await this.productService.findProduct(req);

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}

export default ProductsController;
