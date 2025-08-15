const expressA = require('express');
const routerAuth = expressA.Router();
const { registerUser, loginUser, getProfile, updateProfile } = require('../controllers/authController');
const {protect} = require('../middlewares/authMiddleware');

routerAuth.post('/signup', registerUser);
routerAuth.post('/login', loginUser);
routerAuth.get("/profile",protect, getProfile);
routerAuth.put("/profile/update", protect, updateProfile);

module.exports = routerAuth;
