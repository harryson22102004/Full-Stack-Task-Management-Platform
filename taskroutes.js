const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  bulkUpdateTasks,
  getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post([
    body('title').notEmpty().withMessage('Title is required'),
    body('title').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
  ], createTask);

router.get('/stats', getTaskStats);
router.patch('/bulk', bulkUpdateTasks);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
