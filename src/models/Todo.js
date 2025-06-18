const { getDatabase } = require('../config/database');

class TodoService {
    constructor() {
        this.prisma = getDatabase();
    }

    async create(todoData) {
        const { title, description, completed = false, userId } = todoData;
        
        try {
            const todo = await this.prisma.todo.create({
                data: {
                    title,
                    description,
                    completed,
                    userId: userId ? parseInt(userId) : null
                }
            });
            return todo;
        } catch (error) {
            console.error('Error creating todo:', error);
            throw error;
        }
    }

    async findAll(userId = null) {
        try {
            const where = userId ? { userId: parseInt(userId) } : {};
            
            const todos = await this.prisma.todo.findMany({
                where,
                orderBy: {
                    createdAt: 'desc'
                }
            });
            
            return todos;
        } catch (error) {
            console.error('Error finding todos:', error);
            throw error;
        }
    }

    async findById(id) {
        try {
            const todo = await this.prisma.todo.findUnique({
                where: { id: parseInt(id) }
            });
            
            return todo;
        } catch (error) {
            console.error('Error finding todo by id:', error);
            throw error;
        }
    }

    async update(id, updateData) {
        try {
            const existingTodo = await this.findById(id);
            if (!existingTodo) {
                return null;
            }

            const { title, description, completed } = updateData;
            const updateFields = {};
            
            if (title !== undefined) updateFields.title = title;
            if (description !== undefined) updateFields.description = description;
            if (completed !== undefined) updateFields.completed = completed;

            const updatedTodo = await this.prisma.todo.update({
                where: { id: parseInt(id) },
                data: updateFields
            });
            
            return updatedTodo;
        } catch (error) {
            console.error('Error updating todo:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const result = await this.prisma.todo.delete({
                where: { id: parseInt(id) }
            });
            return !!result;
        } catch (error) {
            console.error('Error deleting todo:', error);
            throw error;
        }
    }

    getById(id) {
        return this.findById(id);
    }
}

module.exports = TodoService;