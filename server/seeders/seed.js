import connectDbB from '../config/db.js';
import seedContractors from './contractorSeeder.js';
import seedProjects from './projectSeeder.js';

const seedDatabase = async () => {
    try {
        console.log('Starting database seeding...');
        
        await connectDbB();
        console.log('Database connected');

        console.log('\nSeeding contractors...');
        await seedContractors();

        console.log('\nSeeding projects...');
        await seedProjects();

        console.log('\n✅ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();

