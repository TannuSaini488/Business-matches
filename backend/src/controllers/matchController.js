const Match = require("../models/Match");
const Document = require("../models/Document");
const Task = require("../models/Task");

const getMatches = async (req, res) => {
  try {
    const userId = req.user._id;
    const matches = await Match.find({
      $or: [{ buyer: userId }, { seller: userId }],
    })
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .populate("documents")
      .populate({
        path: "tasks",
        populate: { path: "createdBy", select: "name email" },
      });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .populate({
        path: "documents",
        populate: { path: "uploader", select: "name email" }
      })
      .populate("tasks");
    if (!match) return res.status(404).json({ message: "Match not found" });
    res.json(match);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const matchId = req.params.id;
    const { text } = req.body;
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });
    match.messages.push({ sender: req.user._id, text });
    await match.save();
    res.json(match);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const uploadDocument = async (req, res) => {
  try {
    const matchId = req.params.id;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const doc = await Document.create({
      match: matchId,
      uploader: req.user._id,
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    match.documents.push(doc._id);
    await match.save();

    res.status(201).json(doc);
  } catch (err) {
    console.error("Upload Document Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const addTask = async (req, res) => {
  try {
    const matchId = req.params.id;
    const { title, description, dueDate } = req.body;

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });

    const task = await Task.create({
      match: matchId,
      title,
      description,
      dueDate,
      createdBy: req.user._id, // <-- Add this
    });

    match.tasks.push(task._id);
    await match.save();

    const populatedTask = await task.populate('createdBy', 'name email');

    res.status(201).json(populatedTask);

  } catch (err) {
    console.error('Error creating task:', err.message); // log exact error
    res.status(500).json({ message: err.message });
  }
};

const updateMatchStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });

    match.status = status;
    await match.save();

    res.json(match);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMatches,
  getMatchById,
  sendMessage,
  uploadDocument,
  addTask,
  updateMatchStatus,
};
