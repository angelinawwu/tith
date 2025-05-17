const migrate = require('mongoose-migrate');
const path = require('path');
require('dotenv').config();

const options = {
    db: process.env.MONGODB_URI,
    migrationsDir: path.join(__dirname, 'migrations'),
    collectionName: 'migrations'
};

migrate(options, (err) => {
    if (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
    console.log('Migration completed successfully');
    process.exit(0);
}); 