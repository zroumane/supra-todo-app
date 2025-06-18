const express = require('express');
const TodoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

const todoController = new TodoController();

// Apply authentication middleware to all todo routes
router.use(authMiddleware);

router.post('/', (req, res) => todoController.createTodo(req, res));
router.get('/', (req, res) => todoController.getTodos(req, res));
router.put('/:id', (req, res) => todoController.updateTodo(req, res));
router.delete('/:id', (req, res) => todoController.deleteTodo(req, res));

module.exports = router;