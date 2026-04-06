const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const sequelize = new Sequelize(
  process.env.FLEET_DB_NAME,
  process.env.FLEET_DB_USER,
  process.env.FLEET_DB_PASSWORD,
  {
    host: process.env.FLEET_DB_HOST,
    dialect: 'mysql',
    logging: console.log, // Enable for debugging, set to false for production
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL fleet management database connected successfully.');
  } catch (error) {
    console.error('Error connecting to MySQL fleet management database:', error);
  }
};

module.exports = { sequelize, connectDB };