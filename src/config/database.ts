import { Sequelize } from 'sequelize';
import { getEnv } from './get-env';

interface MysqlEnv {
  MYSQL_DATABASE: string;
  MYSQL_USER: string;
  MYSQL_PASSWORD: string;
  MYSQL_HOST: string;
  MYSQL_PORT: string;
}

export const sequelize = new Sequelize(
  getEnv<MysqlEnv>('MYSQL_DATABASE'),
  getEnv<MysqlEnv>('MYSQL_USER'),
  getEnv<MysqlEnv>('MYSQL_PASSWORD'),
  {
    host: getEnv<MysqlEnv>('MYSQL_HOST'),
    dialect: 'mysql',
    port: Number(getEnv<MysqlEnv>('MYSQL_PORT', true)),
  }
);
