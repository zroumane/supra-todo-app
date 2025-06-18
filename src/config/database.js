const { PrismaClient } = require('@prisma/client');

let prisma = null;

const connectDatabase = async () => {
    try {
        prisma = new PrismaClient();
        await prisma.$connect();
        console.log('Connected to the database via Prisma.');
        return prisma;
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        throw error;
    }
};

const getDatabase = () => {
    if (!prisma) {
        throw new Error('Database not initialized. Call connectDatabase() first.');
    }
    return prisma;
};

const disconnectDatabase = async () => {
    if (prisma) {
        await prisma.$disconnect();
        console.log('Disconnected from the database.');
    }
};

module.exports = { connectDatabase, getDatabase, disconnectDatabase };