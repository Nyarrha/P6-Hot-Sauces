    // Importation modèle sauce
const Sauce = require('../models/sauce');

    // Exports entre route et middleware
exports.likeSauce = (req, res, next) => {
      // Trouve la sauce en comparant _id à l'id de la sauce demandée
    Sauce.findOne({ _id: req.params.id})
      .then((sauce) => {
        const userId = req.auth.userId;
          // Traitement différents cas like(selon req user)
        switch (req.body.like) {
           // Cas : user like +1, vérifier qu'il n'est pas dans les array liked/disliked puis l'ajouter à array liked
          case 1:
            if(!sauce.usersLiked.includes(userId) && !sauce.usersDisliked.includes(userId)) {
              sauce.usersLiked.push(userId);
            }
            break;
            // Cas : user like 0, vérifier dans quel tableau(liked/disliked) user est puis l'en retirer
          case 0:
            if(sauce.usersLiked.includes(userId)) {
              const indexUser = sauce.usersLiked.indexOf(userId);
              sauce.usersLiked.splice(indexUser, 1);
            };
            if(sauce.usersDisliked.includes(userId)) {
              const indexUser = sauce.usersDisliked.indexOf(userId);
              sauce.usersDisliked.splice(indexUser, 1);
            };
            break; 
            // Cas : user like -1, vérifier qu'il n'est pas dans les array liked/disliked puis l'ajouter à array disliked
          case -1:
            if(!sauce.usersLiked.includes(userId) && !sauce.usersDisliked.includes(userId)) {
              sauce.usersDisliked.push(userId);
            }
            break;
          default:
            res.status(400).json('Bad request');
            break;
        }
          // Affichage nombre de likes et dislikes puis save pour mettre à jour
        sauce.usersLiked.likes = sauce.usersLiked.length;
        sauce.usersDisliked.likes = sauce.usersDisliked.length;
        sauce.save()
        .then(() => res.status(200).json({message: "Sauce notée"}))
        .catch((error) => res.status(401).json(error));
      })
      .catch((error) => res.status(404).json(error));
    };
