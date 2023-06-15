export const mysql = require("mysql2/promise")

export const db =
  process.env.DB_ENV === "mtn"
    ? {
        host: process.env.MYSQL_MTN_HOST,
        port: process.env.MYSQL_MTN_PORT,
        user: process.env.MYSQL_MTN_USER,
        password: process.env.MYSQL_MTN_PASS,
        database: process.env.MYSQL_MTN_DB,
      }
    : process.env.DB_ENV === "morpheus"
    ? {
        host: process.env.MYSQL_MORPHEUS_HOST,
        port: process.env.MYSQL_MORPHEUS_PORT,
        user: process.env.MYSQL_MORPHEUS_USER,
        password: process.env.MYSQL_MORPHEUS_PASS,
        database: process.env.MYSQL_MORPHEUS_DB,
      }
    : {
        host: process.env.MYSQL_LOCAL_HOST,
        port: process.env.MYSQL_LOCAL_PORT,
        user: process.env.MYSQL_LOCAL_USER,
        password: process.env.MYSQL_LOCAL_PASS,
        database: process.env.MYSQL_LOCAL_DB,
      }

export const dbConfig = {
  host: db.host,
  port: db.port,
  user: db.user,
  password: db.password,
  database: db.database,
}

// export const dbConfig = {
//   host: '67.222.1.219',
//   port: 3306,
//   user: 'princemorpheus_mtnn',
//   password: 'db-Pas5w0rd#2012#',
//   database: 'princemorpheus_mtn_prestige',
// };
