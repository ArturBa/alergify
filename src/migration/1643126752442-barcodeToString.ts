import { MigrationInterface, QueryRunner } from 'typeorm';

export class barcodeToString1643126752442 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "barcode" TYPE VARCHAR`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "barcode" TYPE BIGINT`,
    );
  }
}
