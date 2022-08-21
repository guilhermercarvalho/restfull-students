import {
  MySQLDatabase,
  PostgresDatabase,
  SQLiteDatabase
} from 'infra/databases';
import config from 'main/config/env';
import routes from 'main/config/routes';
import { expressApp } from 'main/frameworks';

const chooseDatabase = (dbProvider: string) => {
  if (dbProvider === 'postgres') return new PostgresDatabase();
  if (dbProvider === 'mysql') return new MySQLDatabase();
  if (dbProvider === 'sqlite') return new SQLiteDatabase();

  return new PostgresDatabase();
};

const startServer = async () => {
  const databse = chooseDatabase(config.currentDatabase);

  databse
    .connect()
    .then(async () => {
      const url = `http://${config.host}:${config.port}${routes.version}${routes.students}`;
      const databaseSelected = config.currentDatabase.toUpperCase();

      const app = await expressApp(databse);
      app.listen(config.port, () =>
        console.log(
          `server running at: ${url} with ${databaseSelected} database`
        )
      );
    })
    .catch((error: any) => {
      console.error(error);
    });
};

startServer();
