const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');

const getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' }).lean();
    const sellersWithProfile = await Promise.all(
      sellers.map(async (s) => {
        const profile = await SellerProfile.findOne({ user: s._id }).lean();
        return { ...s, profile }; // attach profile to user
      })
    );
    res.json(sellersWithProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSellerById = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id).select('name email role');
    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    res.json(seller);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get seller profile with buyer requests
const getSellerProfile = async (req, res) => {
  try {
    const sellerId = req.params.id;

    const sellerProfile = await SellerProfile.findOne({ user: sellerId })
      .populate('buyerRequests.buyer', 'name email'); // populate buyer info

    if (!sellerProfile) return res.status(404).json({ message: 'Seller profile not found' });

    res.json(sellerProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Optional: seller responds to buyer request (accept/reject)
const respondSellerRequest = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { buyerId, action } = req.body; // 'accepted' or 'rejected'

    const sellerProfile = await SellerProfile.findOne({ user: sellerId });
    if (!sellerProfile) return res.status(404).json({ message: 'Seller profile not found' });

    const request = sellerProfile.buyerRequests.find(r => r.buyer.toString() === buyerId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = action;
    await sellerProfile.save();

    res.json({ message: `Request ${action}`, sellerProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllSellers, getSellerById, respondSellerRequest, getSellerProfile };
