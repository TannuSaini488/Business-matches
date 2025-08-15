const mongoose3 = require('mongoose');

const sellerProfileSchema = mongoose3.Schema({
  user: { type: mongoose3.Schema.Types.ObjectId, ref: 'User', required: true },
  industry: String,
  revenueRange: String,
  askingPrice: Number,
  assetsIncluded: [String],
  stayPostSale: String,
  buyerPreferences: [String],
  documents: [{ type: mongoose3.Schema.Types.ObjectId, ref: 'Document' }],
  buyerRequests: [
    {
      buyer: { type: mongoose3.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' }
    }
  ]
}, { timestamps: true });

module.exports = mongoose3.model('SellerProfile', sellerProfileSchema);