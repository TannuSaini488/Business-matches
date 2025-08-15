const expressG = require('express');
const multer = require('multer');
const routerDocument = expressG.Router();
const { uploadFile, getDocuments, deleteDocument, updateDocument } = require('../controllers/documentController');
const { protect: protectG } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const uploadDocument = multer({ storage });

routerDocument.post('/', protectG, upload.single('file'), uploadFile);
routerDocument.get('/:matchId', protectG, getDocuments);
routerDocument.put("/:id", uploadDocument.single("file"), protectG, updateDocument);
routerDocument.delete("/:id", protectG, deleteDocument);

module.exports = routerDocument;