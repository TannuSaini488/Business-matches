const mongoose = require('mongoose');

const buyerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  industries: [{ type: String }],
  budgetMin: { type: Number, default: 0 },
  budgetMax: { type: Number, default: 0 },
  dealBreakers: [{ type: String }],
  readinessScore: { type: Number, default: 50 },
  requests: [{ // which seller requested this buyer
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('BuyerProfile', buyerProfileSchema);
