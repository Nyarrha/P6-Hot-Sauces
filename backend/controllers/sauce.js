// Imoortation modèle sauce et module fs
const Sauce = require('../models/sauce');
const fs = require('fs');

// Création/importation fonction réponse POST pour créer une sauce
exports.createSauce = (req, res, next) => {
    // Récupère objet requête de la sauce à créer, supprime son _id et l'userId
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    // Crée un objet sauce à partir des données envoyées et du modèle Sauce, en attribuant un userId généré par auth
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // Initialisation valeurs like/dislike et likes/dislikes
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    // Enregistrement de la sauce
    sauce.save()
    .then(() => {res.status(201).json({ message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json({ error })})
  };


  // Création/importation fonction réponse PUT pour modifier une sauce
  exports.modifySauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
          // Traitement cas : utilisateur non-autorisé
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
                // S'il y a un fichier : le supprimer, et afficher l'erreur
                req.file && fs.unlink(`images/${ req.file.filename }`, err => err && console.log(err));
            } else {
              // Initialiser objet sauce
              let sauceObject = {};
              // Si fichier joint(upload) : récupérer nom fichier actuel dans l'URL puis supprimer le fichier correspondant
              if(req.file){
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${ filename }`, err => {
                  if (err) console.log(err);
                });
              // Modifier les infos de l'objet sauce avec les nouvelles informations(incluant imageUrl et afficher la nouvelle image)
                sauceObject = {
                  ...JSON.parse(req.body.sauce),
                  userId: req.auth.userId,
                  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                  }
              // Sinon : simplement modifier infos avec celles de la requête user
              } else {
                sauceObject = { 
                  ...req.body,
                  userId: req.auth.userId
                }
              };
              // Enregistrer modifications
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(err => res.status(401).json({ err }));
            }
        })
        .catch((error) => {
          // S'il y a un fichier : le supprimer puis afficher l'erreur
          req.file && fs.unlink(`images/${ req.file.filename }`, err => err && console.log(err))
            res.status(400).json({ error });
        });
 };

// Création/exportation fonction réponse DELETE pour supprimer une sauce
  exports.deleteSauce = (req, res, next) => {
    // Compare ID sauce demandée aux ID existantes pour la trouver
    Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
        // Compare userId associé à la sauce et userId qui demande la suppression(si différents : non autorisé)
        if(sauce.userId != req.auth.userId) {
          res.status(401).json({message: 'Non autorisé'});
        // Si correspondance : 
        } else {
          // récupérer le nom du fichier dans l'URL
          const filename = sauce.imageUrl.split('/images')[1];
          // suppression de l'image portant le nom récupéré du dossier "images"
          fs.unlink(`images/${filename}`, () => {
            // puis suppression objet sauce complet
            Sauce.deleteOne({_id: req.params.id})
              .then(() => { res.status(200).json({ message: 'Objet supprimé'})})
              .catch(error => { res.status(401).json({ error })})
          })
        }
      })
    // Renvoi erreur si sauce pas trouvée
      .catch(error => {
        res.status(500).json({ error })
      });
  };

  // Création/exportation fonction réponse GET pour afficher une sauce spécifique
  exports.getOneSauce = (req, res, next) => {
    // Compare l'ID de la sauce demandée à celle de la liste existante(si elle existe)
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json(error));
  };

  // Création/exportation fonction réponse GET pour afficher toutes les sauces
  exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  };

 