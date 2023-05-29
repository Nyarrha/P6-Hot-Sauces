// Importation modèle sauce
const Sauce = require('../models/sauce');

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
      .then((sauce) => {
        // Afficher objet trouvé
        console.log('Résultat objet trouvé :');
        console.log(sauce);
              // Like = 1 (likes += 1)
        // Si userId n'est pas dans la liste usersLiked et que le user likes = 1
        if(!sauce.usersLiked.includes(req.body.userId) && req.body.likes === 1) {
          Sauce.updateOne(
            { _id: req.params.id},
            {
              $inc: {likes: 1},
              $push: {usersLiked: req.body.userId}
            }
          )
          .then(() => res.status(201).json({ message: 'Sauce like +1'}))
          .catch((error) => res.status(400).json(error));
        };

                // Like = 0
        // Si userId est dans usersLiked et user likes = 0
        if(sauce.usersLiked.includes(req.body.userId) && req.body.likes === 0) {
          Sauce.updateOne(
            { _id: req.params.id},
            {
              $inc: {likes: -1},
              $pull: {usersLiked: req.body.userId}
            }
          )
          .then(() => res.status(201).json({ message: 'Sauce neutre 0'}))
          .catch((error) => res.status(400).json(error));
        };

                // Dislike = 1 (dislikes += 1)
        // Si userId n'est pas dans usersDisliked et user dislikes = 1
        if(!sauce.usersDisliked.includes(req.body.userId) && req.body.likes === -1) {
          Sauce.updateOne(
            { _id: req.params.id},
            {
              $inc: {dislikes: 1},
              $push: {usersDisliked: req.body.userId}
            }
          )
          .then(() => res.status(201).json({ message: 'Sauce dislike -1'}))
          .catch((error) => res.status(400).json(error));
        };

                // Dislike = 0
        // Si userId est dans usersDisliked et user dislikes = 0
        if(sauce.usersDisliked.includes(req.body.userId) && req.body.likes === 0) {
          Sauce.updateOne(
            { _id: req.params.id},
            {
              $inc: {dislikes: -1},
              $pull: {usersDisliked: req.body.userId}
            }
          )
          .then(() => res.status(201).json({ message: 'Sauce neutre 0'}))
          .catch((error) => res.status(400).json(error));
        };
      })
      .catch((error) => res.status(404).json(error));
    };


    // *********        ******* //
    // Bug noté : en cas de requête Postman, si key "dislikes" = 1, ajoute quand même le userId dans usersLiked en doublons
    // Régler création doublons
    // Régler souci auth(userId et token non valides, mais ça envoie quand même la requête)