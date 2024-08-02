const express = require('express');
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/todos', authMiddleware, async (req, res) => {
  const { title } = req.body;
  try {
    const todo = new Todo({
      title,
      userId: req.user._id,
    });
    await todo.save();
    res.status(201).send(todo);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/todos', authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id });
    res.send(todos);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.put('/todos/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    const todo = await Todo.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true }
    );
    if (!todo) return res.status(404).send('Todo not found');
    res.send(todo);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.delete('/todos/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) return res.status(404).send('Todo not found');
    res.send('Todo deleted');
  } catch (err) {
    res.status(500).send('Server error');
  }
});


module.exports = router;
