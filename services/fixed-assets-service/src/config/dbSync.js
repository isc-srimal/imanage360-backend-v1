const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log,
  }
);


sequelize.authenticate()
  .then(() => console.log('MySQL fixed assets database connected successfully.'))
  .catch(err => console.error('Error connecting to MySQL fixed assets database:', err));

module.exports = sequelize;