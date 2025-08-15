const DocumentModel = require("../models/Document");
const Match = require('../models/Match.js');
const fs = require('fs');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const doc = await DocumentModel.create({
      uploader: req.user._id,
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getDocuments = async (req, res) => {
  try {
    const { matchId } = req.params;

    // If no matchId provided, return error
    if (!matchId) {
      return res.status(400).json({ message: "Match ID is required" });
    }

    const docs = await DocumentModel.find({ match: matchId })
      .populate("uploader", "name email")
      .populate("match", "_id");

    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete document
const deleteDocument = async (req, res) => {
  try {
    const doc = await DocumentModel.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Optional: check if the logged-in user is the uploader
    if (req.user && doc.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Remove file from disk
    if (fs.existsSync(doc.path)) fs.unlinkSync(doc.path);

    // Remove from Match
    await Match.findByIdAndUpdate(doc.match, {
      $pull: { documents: doc._id },
    });

    // Remove from DB
    await doc.deleteOne();

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update document
const updateDocument = async (req, res) => {
  try {
    const doc = await DocumentModel.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Optional: check uploader
    if (req.user && doc.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Remove old file
    if (fs.existsSync(doc.path)) fs.unlinkSync(doc.path);

    // Update document details
    doc.filename = req.file.filename;
    doc.path = req.file.path;
    doc.mimetype = req.file.mimetype;
    doc.size = req.file.size;
    await doc.save();

    res.json({ message: "Document updated successfully", doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { uploadFile, getDocuments, deleteDocument, updateDocument };
