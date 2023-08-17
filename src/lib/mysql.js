import { createPool } from "mysql2/promise";

const getDbConfig = (env) => {
  switch (env) {
    case "staging":
      return {
        host: process.env.MYSQL_MTN_HOST,
        port: process.env.MYSQL_MTN_PORT,
        user: process.env.MYSQL_MTN_USER,
        password: process.env.MYSQL_MTN_PASS,
        database: process.env.MYSQL_MTN_DB,
      };
    case "production":
      return {
        host: process.env.MYSQL_MTN_PRODUCTION_HOST,
        port: process.env.MYSQL_MTN_PRODUCTION_PORT,
        user: process.env.MYSQL_MTN_PRODUCTION_USER,
        password: process.env.MYSQL_MTN_PRODUCTION_PASS,
        database: process.env.MYSQL_MTN_PRODUCTION_DB,
      };
    default:
      return {
        host: process.env.MYSQL_LOCAL_HOST,
        port: process.env.MYSQL_LOCAL_PORT,
        user: process.env.MYSQL_LOCAL_USER,
        password: process.env.MYSQL_LOCAL_PASS,
        database: process.env.MYSQL_LOCAL_DB,
      };
  }
};

const dbEnv = process.env.DB_ENV;
const dbConfig = getDbConfig(dbEnv);

export const connectionPool = createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
});
