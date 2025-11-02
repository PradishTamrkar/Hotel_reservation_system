// const { Sequelize } = require('sequelize');
// require('dotenv').config(); // Load environment variables from .env file

// // Log environment variables for debugging
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_PORT:', process.env.DB_PORT);
// console.log('DB_NAME:', process.env.DB_NAME);

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   String(process.env.DB_PASSWORD), // Force password to be a string
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: 'postgres',
//   }
// );

// // Test the database connection
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection to database successful');
//   })
//   .catch((err) => {
//     console.error('Unable to connect to the database:', err);
//   });

// module.exports = sequelize;

const { Sequelize } = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = require('./env');
console.log('DB_USER:', DB_USER);
console.log('DB_PASSWORD:', DB_PASSWORD);

const sequelize = new Sequelize(DB_NAME, DB_USER, String(DB_PASSWORD), {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;
