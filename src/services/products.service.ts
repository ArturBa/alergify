import { FindManyOptions, getRepository, In, Like } from 'typeorm';
import { CreateProductDto } from '@dtos/products.dto';
import { IngredientEntity } from '@entity/ingredients.entity';
import { ProductEntity } from '@entity/products.entity';
import { Product, ProductGetRequest } from '@interfaces/products.interface';
import { PaginateResponse } from '@interfaces/internal/response.interface';
import { checkIfConflict, checkIfEmpty } from './common.service';
import { GetParamsBuilder } from './internal/get-params-builder';

class GetProductQueryBuilder extends GetParamsBuilder<
  ProductEntity,
  ProductGetRequest
> {
  constructor() {
    super();
    this.query = {
      ...this.query,
      select: ['id', 'name', 'barcode'],
    };
  }

  build(request: ProductGetRequest): void {
    this.addPaginate(request);
    this.addBarcode(request);
    this.addName(request);
  }

  getTotal(): FindManyOptions<ProductEntity> {
    const totalQuery = { ...this.query };
    delete totalQuery.skip;
    delete totalQuery.take;
    return totalQuery;
  }

  protected addPaginate({ start, limit }: ProductGetRequest) {
    this.query = {
      ...this.query,
      skip: start,
      take: limit,
    };
  }

  protected addName({ name }: ProductGetRequest): void {
    if (name) {
      this.appendWhere({ name: Like(`%${name}%`) });
    }
  }

  protected addBarcode({ barcode }: ProductGetRequest): void {
    if (barcode) {
      this.appendWhere({ barcode });
    }
  }
}

class ProductsService {
  public products = ProductEntity;

  public ingredients = IngredientEntity;

  public async findProduct(
    request: ProductGetRequest,
  ): Promise<PaginateResponse<Partial<Product>>> {
    const productRepository = getRepository(this.products);
    const queryBuilder = new GetProductQueryBuilder();
    queryBuilder.build(request);
    const data = await productRepository.find(queryBuilder.get());
    const total = await productRepository.count(queryBuilder.getTotal());

    return { data, total };
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
      where: { id: In(productData.ingredients) },
    });
    checkIfConflict(ingredients.length !== productData.ingredients.length);

    const product = new ProductEntity();
    product.barcode = productData.barcode;
    product.name = productData.name;
    product.ingredients = ingredients;

    await productRepository.save(product);
  }
}

export default ProductsService;
