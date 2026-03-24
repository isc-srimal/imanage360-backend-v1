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
  .then(() => console.log('MySQL human resources database connected successfully.'))
  .catch(err => console.error('Error connecting to MySQL human resources database:', err));

module.exports = sequelize;