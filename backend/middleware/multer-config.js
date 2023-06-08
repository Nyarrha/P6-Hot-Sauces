// Importation module
const multer = require('multer');

// Définition des formats fichiers acceptés
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

// Paramétrage fichier image :
const storage = multer.diskStorage({
    // Sa destination
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // Ses informations(nom, format)
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension)
    }
});

module.exports = multer({ storage: storage }).single('image');