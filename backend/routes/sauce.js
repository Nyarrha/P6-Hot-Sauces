const express = require('express');
const router = express.Router();

// Importation middleware authentification
const auth = require('../middleware/auth');

// Importation middleware multer pour gérer fichiers images
const multer = require('../middleware/multer-config');

// Importation controllers "sauce"
const sauceCtrl = require('../controllers/sauce');

// Importation controller "like"
const like = require('../controllers/like');


// Routes
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce); 
router.post('/:id/like', auth, like.likeSauce);

module.exports = router;