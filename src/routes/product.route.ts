import { Router } from 'express';
import ProductsController from '@controllers/products.contoller';
import { ProductCreateDto, GetProductDto } from '@dtos/products.dto';
import { Routes } from '@interfaces/internal/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { getProductsMiddleware } from '@middlewares/products.middleware';

class ProductRoute implements Routes {
  public path = '/product';

  public router = Router();

  public productsController = new ProductsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(ProductCreateDto),
      this.productsController.createProduct,
    );
    this.router.get(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.productsController.get,
    );
    this.router.get(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(GetProductDto, 'query'),
      getProductsMiddleware,
      this.productsController.findProduct,
    );
  }
}

export default ProductRoute;
