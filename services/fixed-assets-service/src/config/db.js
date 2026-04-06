const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const sequelize = new Sequelize(
  process.env.ASSETS_DB_NAME,
  process.env.ASSETS_DB_USER,
  process.env.ASSETS_DB_PASSWORD,
  {
    host: process.env.ASSETS_DB_HOST,
    dialect: 'mysql',
    logging: console.log, // Enable for debugging, set to false for production
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL fixed assets database connected successfully.');
  } catch (error) {
    console.error('Error connecting to MySQL fixed assets database:', error);
  }
};

module.exports = { sequelize, connectDB };