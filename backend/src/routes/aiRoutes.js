const expressH = require('express');
const routerAi = expressH.Router();
const { financialSummary } = require('../controllers/aiController');
const {protect: protectH} = require('../middlewares/authMiddleware');

routerAi.post('/financial-summary/:docId', protectH, financialSummary);

module.exports = routerAi;