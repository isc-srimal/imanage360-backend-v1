const seedDatabase = require('./seedDatabase');

const runSeeder = async () => {
    try {
        await seedDatabase();
    } catch (error) {
        console.error('Seeder encountered an error:', error);
    } finally {
        process.exit(); 
    }
};

runSeeder();
