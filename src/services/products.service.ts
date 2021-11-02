import { getRepository } from 'typeorm';
import { CreateProductDto } from '@dtos/products.dto';
import { IngredientEntity } from '@entity/ingredients.entity';
import { ProductEntity } from '@entity/products.entity';
import { Product } from '@interfaces/products.interface';
import { checkIfConflict, checkIfEmpty } from './common.services';

class ProductsService {
  public products = ProductEntity;
  public ingredients = IngredientEntity;

  public async findProductByQuery(query: string): Promise<Product[]> {
    checkIfEmpty(query);

    const productRepository = getRepository(this.products);
    const products = await productRepository.find({
      where: { name: query },
    });

    return products;
  }

  public async getProductById(productId: number): Promise<Partial<Product>> {
    checkIfEmpty(productId);

    const productRepository = getRepository(this.products);
    const product = await productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.ingredients', 'ingredients')
      .where('product.id = :id', { id: productId })
      .select([
        'product.id',
        'product.barcode',
        'product.name',
        'ingredients.id',
        'ingredients.name',
      ])
      .getOne();
    checkIfConflict(!product);

    return product;
  }

  public async createProduct(productData: CreateProductDto): Promise<void> {
    checkIfEmpty(productData);

    const productRepository = getRepository(this.products);
    const ingredients = await getRepository(this.ingredients).find({
      where: { id: productData.ingredients },
    });
    checkIfConflict(!ingredients);

    const product = new ProductEntity();
    product.barcode = productData.barcode;
    product.name = productData.name;
    product.ingredients = ingredients;

    await productRepository.save(product);
  }
}

export default ProductsService;
