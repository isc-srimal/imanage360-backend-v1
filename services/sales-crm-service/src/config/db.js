const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log, // Enable for debugging, set to false for production
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL sales crm database connected successfully.');
  } catch (error) {
    console.error('Error connecting to MySQL sales crm database:', error);
  }
};

module.exports = { sequelize, connectDB };