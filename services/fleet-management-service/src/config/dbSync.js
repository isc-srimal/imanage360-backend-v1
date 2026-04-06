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
    logging: console.log,
  }
);


sequelize.authenticate()
  .then(() => console.log('MySQL fleet management database connected successfully.'))
  .catch(err => console.error('Error connecting to MySQL fleet management database:', err));

module.exports = sequelize;