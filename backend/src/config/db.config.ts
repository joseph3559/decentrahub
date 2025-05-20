// src/config/db.config.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is not set.');
  process.exit(1);
}

// Initialize Sequelize with the DATABASE_URL
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres', // Specify the dialect
  logging: process.env.NODE_ENV === 'development' ? console.log : false, // Log SQL queries in development
  dialectOptions: {
    // ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false, // Example for SSL if needed for cloud DBs
  },
  pool: { // Optional: configure connection pooling
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connection has been established successfully! 🎉');
    console.log(`Connected to database: ${sequelize.getDatabaseName()}`);

    // Sync all defined models to the DB.
    // { alter: true } attempts to update the table schema to match the model
    // without dropping the table. This is generally safer for development than { force: true }.
    // For a hackathon, this is usually sufficient.
    // For production, you would typically use migrations.
    await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully (tables created/altered).");

  } catch (error: any) {
    console.error('Unable to connect to the PostgreSQL database or synchronize models! 😭:', error.message);
    if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeAccessDeniedError') {
        console.error('This might be due to the PostgreSQL server not running, incorrect credentials, or database not existing.');
    }
    process.exit(1); // Exit process with failure
  }
};

// Function to safely close the connection (for graceful shutdown)
const disconnectDB = async (): Promise<void> => {
  try {
    await sequelize.close();
    console.log('PostgreSQL connection closed.');
  } catch (error) {
    console.error('Error closing PostgreSQL connection:', error);
  }
};

export { sequelize, connectDB, disconnectDB };
