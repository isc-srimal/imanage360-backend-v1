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
    logging: console.log,
  }
);


sequelize.authenticate()
  .then(() => console.log('MySQL fixed assets database connected successfully.'))
  .catch(err => console.error('Error connecting to MySQL fixed assets database:', err));

module.exports = sequelize;