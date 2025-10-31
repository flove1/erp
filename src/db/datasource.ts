import config from "config";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.DB.HOST,
  port: config.DB.PORT,
  username: config.DB.USER,
  password: config.DB.PASSWORD,
  database: config.DB.NAME,
  synchronize: true,
  entities: [__dirname + '/entities/*.{ts,js}'],
});
