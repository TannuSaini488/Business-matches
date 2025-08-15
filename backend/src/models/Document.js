const mongoose4 = require('mongoose');

const documentSchema = mongoose4.Schema({
  match: { type: mongoose4.Schema.Types.ObjectId, ref: 'Match' },
  uploader: { type: mongoose4.Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  path: String,
  mimetype: String,
  size: Number
}, { timestamps: true });

module.exports = mongoose4.model('Document', documentSchema);