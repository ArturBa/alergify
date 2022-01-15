import { MigrationInterface, QueryRunner } from 'typeorm';

export class dropAllergensCount1642272889156 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`ALTER TABLE "allergens" DROP COLUMN "count"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `ALTER TABLE "allergens" ADD "count" integer NOT NULL DEFAULT 0`,
    );
  }
}
