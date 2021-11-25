import { Router } from 'express';
import ProductsController from '@controllers/products.contoller';
import { CreateProductDto } from '@dtos/products.dto';
import { Routes } from '@interfaces/internal/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

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
      validationMiddleware(CreateProductDto),
      this.productsController.createProduct,
    );
    this.router.get(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.productsController.getProductById,
    );
    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.productsController.findProductByQuery,
    );
  }
}

export default ProductRoute;
