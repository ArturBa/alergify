import { Mixin } from 'ts-mixer';
import { PaginateDto } from './internal/parameters/paginate.dto';

export class GetAllergensDto extends Mixin(PaginateDto) {}

export default GetAllergensDto;
