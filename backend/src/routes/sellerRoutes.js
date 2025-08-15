const express = require("express");
const { getAllSellers, getSellerById, getSellerProfile, respondSellerRequest } = require("../controllers/sellerController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", protect, getAllSellers);
router.get("/:id", protect, getSellerById);

router.get('/:id', protect, getSellerProfile);

router.post('/:id/respond', protect, respondSellerRequest);

module.exports = router;
