const multer = require('multer');
// Set up storage for uploaded files
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploaded_files/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const upload = multer({ storage: multerStorage})

module.exports = upload;