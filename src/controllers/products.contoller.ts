import { Request, Response, NextFunction } from 'express';
import { CreateProductDto } from '@dtos/products.dto';
import HttpStatusCode from '@interfaces/internal/http-codes.interface';
import ProductsService from '@services/products.service';

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

  public getProductByBarcode = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const productBarcode = Number(req.params.barcode);
      const product = await this.productService.getProductByBarcode(
        productBarcode,
      );

      res.status(HttpStatusCode.OK).json({ ...product });
    } catch (error) {
      next(error);
    }
  };

  public createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const productData: CreateProductDto = req.body;
      await this.productService.createProduct(productData);

      res.sendStatus(HttpStatusCode.CREATED);
    } catch (error) {
      next(error);
    }
  };

  public findProductByQuery = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { query } = req;
      throw new Error('Not implemented yet');
      const products = await this.productService.findProductByQuery('');

      res.status(HttpStatusCode.OK).json({ ...products });
    } catch (error) {
      next(error);
    }
  };
}

export default ProductsController;
