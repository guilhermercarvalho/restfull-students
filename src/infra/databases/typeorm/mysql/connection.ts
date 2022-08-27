import { Database } from 'infra/contracts';
import { DataSource } from 'typeorm';
import { connectionSourceMySQL } from './data-source';

export class MySQLDatabase implements Database {
  private dataSource!: DataSource;

  async connect() {
    this.dataSource = connectionSourceMySQL;
    await this.dataSource.initialize();
    await this.dataSource.runMigrations();
  }

  getConnection(): DataSource {
    return this.dataSource;
  }
}
