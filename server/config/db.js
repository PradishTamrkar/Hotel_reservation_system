const { Sequelize } = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = require('./env');
console.log('DB_USER:', DB_USER);
console.log('DB_PASSWORD:', DB_PASSWORD ? '***' : 'undefined');

const sequelize = new Sequelize(DB_NAME, DB_USER, String(DB_PASSWORD), {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
  dialectOptions:{
    ssl:{
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;
