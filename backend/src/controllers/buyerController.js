const BuyerProfile = require("../models/BuyerProfile");
const User = require("../models/User");
const Match = require("../models/Match");

const getAllBuyers = async (req,res) => {
  try{
    const buyers = await BuyerProfile.find().populate('user','name email');
    res.json(buyers);
  }catch(err){
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
};

const acceptBuyer = async (req,res) => {
  try{
    const sellerId = req.user._id;
    const buyerProfileId = req.params.id;

    const buyerProfile = await BuyerProfile.findById(buyerProfileId);
    if(!buyerProfile) return res.status(404).json({ message:'Buyer not found' });

    // Check if already requested
    const existing = buyerProfile.requests.find(r => r.seller.toString() === sellerId.toString());
    if(existing) return res.status(400).json({ message:'Already responded' });

    // Add request
    buyerProfile.requests.push({ seller: sellerId, status:'accepted' });
    await buyerProfile.save();

    await Match.create({
      buyer: buyerProfile.user,
      seller: sellerId,
      status:'pending'
    });

    res.json({ message:'Buyer accepted' });
  }catch(err){
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
};

const rejectBuyer = async (req,res) => {
  try{
    const sellerId = req.user._id;
    const buyerProfileId = req.params.id;

    const buyerProfile = await BuyerProfile.findById(buyerProfileId);
    if(!buyerProfile) return res.status(404).json({ message:'Buyer not found' });

    const existing = buyerProfile.requests.find(r => r.seller.toString() === sellerId.toString());
    if(existing) return res.status(400).json({ message:'Already responded' });

    buyerProfile.requests.push({ seller: sellerId, status:'rejected' });
    await buyerProfile.save();

    res.json({ message:'Buyer rejected' });
  }catch(err){
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
};

const getBuyerById = async (req, res) => {
  try {
    const buyer = await User.findById(req.params.id).select("name email role");
    if (!buyer) return res.status(404).json({ message: "Buyer not found" });
    res.json(buyer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const requestBuyer = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const buyerId = req.params.id;

    const buyer = await BuyerProfile.findById(buyerId);
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

    // Avoid duplicate requests
    if (!buyer.requests.find(r => r.seller.toString() === sellerId)) {
      buyer.requests.push({ seller: sellerId });
      await buyer.save();
    }

    res.json({ message: 'Request sent', buyer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const respondBuyerRequest = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { sellerId, action } = req.body; // action = 'accepted' | 'rejected'

    const buyerProfile = await BuyerProfile.findOne({ user: buyerId });
    if (!buyerProfile) return res.status(404).json({ message: 'Buyer profile not found' });

    const request = buyerProfile.requests.find(r => r.seller.toString() === sellerId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = action;
    await buyerProfile.save();

    res.json({ message: `Request ${action}`, buyerProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllBuyers, getBuyerById, acceptBuyer, rejectBuyer, requestBuyer, respondBuyerRequest };
