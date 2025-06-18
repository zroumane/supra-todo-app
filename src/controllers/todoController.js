const TodoService = require('../models/Todo');

class TodoController {
    constructor() {
        this.todoService = new TodoService();
    }

    async createTodo(req, res) {
        const { title, description, text } = req.body;
        const userId = req.user ? req.user.id : null;
        
        // Handle both 'text' (frontend) and 'title' (backend) fields
        const todoTitle = title || text || '';
        const todoDescription = description || '';
        
        if (!todoTitle.trim()) {
            return res.status(400).json({ message: 'Title is required' });
        }
        
        try {
            const newTodo = await this.todoService.create({ 
                title: todoTitle, 
                description: todoDescription, 
                completed: false,
                userId 
            });
            res.status(201).json(newTodo);
        } catch (error) {
            console.error('Error creating todo:', error);
            res.status(500).json({ message: 'Error creating todo', error: error.message });
        }
    }

    async getTodos(req, res) {
        const userId = req.user ? req.user.id : null;
        
        try {
            const todos = await this.todoService.findAll(userId);
            res.status(200).json(todos);
        } catch (error) {
            console.error('Error retrieving todos:', error);
            res.status(500).json({ message: 'Error retrieving todos', error: error.message });
        }
    }

    async updateTodo(req, res) {
        const { id } = req.params;
        const { title, description, completed, text } = req.body;
        const userId = req.user ? req.user.id : null;
        
        // Handle both 'text' (frontend) and 'title' (backend) fields
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (text !== undefined) updateData.title = text;
        if (description !== undefined) updateData.description = description;
        if (completed !== undefined) updateData.completed = completed;
        
        try {
            // First check if the todo exists and belongs to the user
            const existingTodo = await this.todoService.findById(id);
            if (!existingTodo) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            
            if (userId && existingTodo.userId !== userId) {
                return res.status(403).json({ message: 'Access denied' });
            }
            
            const updatedTodo = await this.todoService.update(id, updateData);
            if (updatedTodo) {
                res.status(200).json(updatedTodo);
            } else {
                res.status(404).json({ message: 'Todo not found' });
            }
        } catch (error) {
            console.error('Error updating todo:', error);
            res.status(500).json({ message: 'Error updating todo', error: error.message });
        }
    }

    async deleteTodo(req, res) {
        const { id } = req.params;
        const userId = req.user ? req.user.id : null;
        
        try {
            // First check if the todo exists and belongs to the user
            const existingTodo = await this.todoService.findById(id);
            if (!existingTodo) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            
            if (userId && existingTodo.userId !== userId) {
                return res.status(403).json({ message: 'Access denied' });
            }
            
            const deleted = await this.todoService.delete(id);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Todo not found' });
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
            res.status(500).json({ message: 'Error deleting todo', error: error.message });
        }
    }
}

module.exports = TodoController;