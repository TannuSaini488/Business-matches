const expressC = require('express');
const routerBuyer = expressC.Router();
const { getAllBuyers, getBuyerById, acceptBuyer, rejectBuyer, requestBuyer, respondBuyerRequest } = require('../controllers/buyerController');
const { protect: protectC } = require('../middlewares/authMiddleware');

routerBuyer.get('/', protectC, getAllBuyers);
routerBuyer.get('/:id', protectC, getBuyerById);
routerBuyer.post('/:id/accept', protectC, acceptBuyer);
routerBuyer.post('/:id/reject', protectC, rejectBuyer);

routerBuyer.post('/:id/request', protectC, requestBuyer);
routerBuyer.post('/:id/respond', protectC, respondBuyerRequest);

module.exports = routerBuyer;