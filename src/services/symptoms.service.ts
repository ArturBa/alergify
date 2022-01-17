import { SymptomEntity } from '@entity/symptoms.entity';

import { BaseService } from './internal/base.service';

export class SymptomService extends BaseService<SymptomEntity> {
  protected entity = SymptomEntity;

  create(_: unknown): Promise<SymptomEntity> {
    throw new Error('Method not implemented.');
  }

  update(_: unknown): Promise<SymptomEntity> {
    throw new Error('Method not implemented.');
  }
}

export default SymptomService;
