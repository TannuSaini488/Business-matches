const expressF = require('express');
const routerTask = expressF.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect: protectF } = require('../middlewares/authMiddleware');

routerTask.get('/', protectF, getTasks);
routerTask.post('/', protectF, createTask);
routerTask.put('/:id', protectF, updateTask);
routerTask.delete('/:id', protectF, deleteTask);

module.exports = routerTask;