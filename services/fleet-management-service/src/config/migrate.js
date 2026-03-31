const sequelize = require('../config/dbSync');
const seedDatabase = require('./seedDatabase'); 

const runMigration = async (mode = 'migrate') => {
  try {
    if (mode === 'fresh') {
      console.log('Running migrate:fresh...');
      await seedDatabase({ force: true });
    } else {
      console.log('Running migrate...');
      await seedDatabase({ alter: true });
    }
    console.log(`${mode === 'fresh' ? 'Migrate:fresh' : 'Migrate'} completed successfully.`);
  } catch (error) {
    console.error(`Error running ${mode} migration:`, error);
  } finally {
    await sequelize.close();
    process.exit();
  }
};

// Parse command-line arguments
const mode = process.argv[2] || 'migrate';
runMigration(mode);