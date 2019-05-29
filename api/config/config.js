const env2 = require('env2');

if (process.env.NODE_ENV === 'production') {
  env2('./.env.prod');
} else {
  env2('./.env');
}


const { env } = process;

module.exports = {
  development: {
    username: 'root',
    password: null,
    database: 'hapi_db_dev',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      socketPath: '/tmp/mysql.sock',
      supportBigNumbers: true,
      bigNumberStrings: true
    },
  },
  production: {
    username: 'root',
    password: null,
    database: 'hapi_db_prod',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      socketPath: '/tmp/mysql.sock',
      supportBigNumbers: true,
      bigNumberStrings: true
    },
  },

  // production: {
  //   username: env.MYSQL_USERNAME,
  //   password: env.MYSQL_PASSWORD,
  //   database: env.MYSQL_DB_NAME,
  //   host: env.MYSQL_HOST,
  //   port: env.MYSQL_PORT,
  //   dialect: 'mysql',
  //   dialectOptions: {
  //     socketPath: '/tmp/mysql.sock',
  //     supportBigNumbers: true,
  //     bigNumberStrings: true
  //   },
  // },
};
