const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const sequelize = new Sequelize(
  process.env.HR_DB_NAME,
  process.env.HR_DB_USER,
  process.env.HR_DB_PASSWORD,
  {
    host: process.env.HR_DB_HOST,
    dialect: 'mysql',
    logging: console.log, // Enable for debugging, set to false for production
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL human resources database connected successfully.');
  } catch (error) {
    console.error('Error connecting to MySQL human resources database:', error);
  }
};

module.exports = { sequelize, connectDB };