const UserModel = require('../models/User');
const BuyerProfile = require('../models/BuyerProfile');
const SellerProfile = require('../models/SellerProfile');
const {generateToken} = require('../utils/generateToken');

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: 'Missing fields' });

    const exists = await UserModel.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = await UserModel.create({ name, email, password, role });

    // Automatically create BuyerProfile if user is a buyer
    if (role === 'buyer') {
      await BuyerProfile.create({ user: user._id });
    }

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user && await user.matchPassword(password)) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const user = await UserModel.findById(userId)
      .select("-password") // exclude password
      .lean();
    
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const updateProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update basic user info
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    await user.save();

    if (user.role === "buyer") {
      let profile = await BuyerProfile.findOne({ user: user._id });
      if (!profile) profile = new BuyerProfile({ user: user._id });

      profile.industries = req.body.industries || profile.industries;
      profile.budgetMin = req.body.budgetMin || profile.budgetMin;
      profile.budgetMax = req.body.budgetMax || profile.budgetMax;
      profile.dealBreakers = req.body.dealBreakers || profile.dealBreakers;
      profile.readinessScore = req.body.readinessScore || profile.readinessScore;

      await profile.save();
      return res.json({ message: "Profile updated", profile });
    }

    if (user.role === "seller") {
      let profile = await SellerProfile.findOne({ user: user._id });
      if (!profile) profile = new SellerProfile({ user: user._id });

      profile.industry = req.body.industry || profile.industry;
      profile.revenueRange = req.body.revenueRange || profile.revenueRange;
      profile.askingPrice = req.body.askingPrice || profile.askingPrice;
      profile.assetsIncluded = req.body.assetsIncluded || profile.assetsIncluded;
      profile.stayPostSale = req.body.stayPostSale || profile.stayPostSale;
      profile.buyerPreferences = req.body.buyerPreferences || profile.buyerPreferences;

      await profile.save();
      return res.json({ message: "Profile updated", profile });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };