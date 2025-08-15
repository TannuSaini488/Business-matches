const TaskModel = require('../models/Task');
const Match = require('../models/Match');

const getTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find()
      .populate('match', 'name')
      .populate('createdBy', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const updatedTask = await TaskModel.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed
      },
      { new: true }
    )
    .populate('createdBy', 'name email')
    .populate('match', 'name');

    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    await TaskModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, match } = req.body;

    if (!match) return res.status(400).json({ message: 'Match ID is required' });

    const newTask = await TaskModel.create({
      title,
      description,
      dueDate,
      match,
      createdBy: req.user._id, // must come from auth middleware
    });

    const matchDoc = await Match.findById(match);
    if (matchDoc) {
      matchDoc.tasks.push(newTask._id);
      await matchDoc.save();
    }

    const populatedTask = await newTask.populate('createdBy', 'name email');

    res.status(201).json(populatedTask);

  } catch (err) {
    console.error('Error creating task:', err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };