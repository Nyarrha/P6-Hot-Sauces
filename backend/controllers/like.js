// Importation modèle sauce
const Sauce = require('../models/sauce');

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
      .then((sauce) => {
        console.log('Contenu objet response');
        console.log(sauce);
        if(userId != req.auth.userId){}
      })
  }

// chercher id sauce(findOne)
// vérifier utilisateur(userId = req.auth.userId)
// modifier valeur like
// ajouter au bon tableau