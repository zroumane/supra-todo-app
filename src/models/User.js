const { getDatabase } = require('../config/database');
const bcrypt = require('bcryptjs');

class UserService {
    constructor() {
        this.prisma = getDatabase();
    }

    async create(userData) {
        const { email, password, name } = userData;
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        try {
            const user = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            return await this.prisma.user.findUnique({
                where: { email }
            });
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    async findById(id) {
        try {
            return await this.prisma.user.findUnique({
                where: { id: parseInt(id) },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
        } catch (error) {
            console.error('Error finding user by id:', error);
            throw error;
        }
    }

    async verifyPassword(email, password) {
        try {
            const user = await this.findByEmail(email);
            if (!user) {
                return null;
            }
            
            const isValid = bcrypt.compareSync(password, user.password);
            if (isValid) {
                // Return user without password
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name
                };
            }
            return null;
        } catch (error) {
            console.error('Error verifying password:', error);
            throw error;
        }
    }
}

module.exports = UserService;