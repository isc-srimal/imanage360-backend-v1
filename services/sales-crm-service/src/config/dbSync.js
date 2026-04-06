const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const sequelize = new Sequelize(
  process.env.SALES_CRM_DB_NAME,
  process.env.SALES_CRM_DB_USER,
  process.env.SALES_CRM_DB_PASSWORD,
  {
    host: process.env.SALES_CRM_DB_HOST,
    dialect: 'mysql',
    logging: console.log,
  }
);


sequelize.authenticate()
  .then(() => console.log('MySQL sales crm database connected successfully.'))
  .catch(err => console.error('Error connecting to MySQL sales crm database:', err));

module.exports = sequelize;