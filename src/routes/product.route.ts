import { Router } from 'express';
import ProductsController from '../controllers/products.contoller';
import { CreateProductDto } from '../dtos/products.dto';
import { Routes } from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validation.middleware';

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
  }
}

export default ProductRoute;
