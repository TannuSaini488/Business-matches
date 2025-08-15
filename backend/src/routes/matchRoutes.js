const expressE = require('express');
const routerMatch = expressE.Router();
const { getMatches, getMatchById, sendMessage, uploadDocument, addTask, updateMatchStatus } = require('../controllers/matchController');
const { protect: protectE } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

routerMatch.get('/', protectE, getMatches);
routerMatch.get('/:id', protectE, getMatchById);
routerMatch.post('/:id/chat', protectE, sendMessage);
routerMatch.post('/:id/documents', protectE, upload.single('file'), uploadDocument);
routerMatch.post('/:id/tasks', protectE, addTask);
routerMatch.put('/:id/status', protectE, updateMatchStatus);

module.exports = routerMatch;