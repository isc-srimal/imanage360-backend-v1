const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const sequelize = new Sequelize(
  process.env.USER_DB_NAME,
  process.env.USER_DB_USER,
  process.env.USER_DB_PASSWORD,
  {
    host: process.env.USER_DB_HOST,
    dialect: 'mysql',
    logging: console.log, // Enable for debugging, set to false for production
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL user management database connected successfully.');
  } catch (error) {
    console.error('Error connecting to MySQL user management database:', error);
  }
};

module.exports = { sequelize, connectDB };