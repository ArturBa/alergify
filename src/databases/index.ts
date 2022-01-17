import config from 'config';
import path from 'path';
import { ConnectionOptions } from 'typeorm';
import { DbConfig } from '@interfaces/internal/db.interface';

const { database }: DbConfig = config.get('dbConfig');
export const dbConnection: ConnectionOptions = {
  type: 'sqlite',
  database,
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '../**/migration/*{.ts,.js}')],
  subscribers: [path.join(__dirname, '../**/*.subscriber{.ts,.js}')],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};

export default dbConnection;
