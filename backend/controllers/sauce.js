const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    sauce.save()
    .then(() => {res.status(201).json({ message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json({ error })})
  };

  exports.modifySauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
          // Traitement cas : utilisateur non-autorisé
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
                // if(req.file){
                //   fs.unlink(`images/${ req.file.filename }`, err => {
                //     if (err) console.log(err);
                //   });
                // }

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
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(err => res.status(401).json({ err }));
            }
        })
        .catch((error) => {
          // S'il y a un fichier : le supprimer puis afficher l'erreur
          req.file && fs.unlink(`images/${ req.file.filename }`, err => err && console.log(err))
          // if(req.file){
          //   fs.unlink(`images/${ req.file.filename }`, err => {
          //     if (err) console.log(err);
          //   });
          // }
            res.status(400).json({ error });
        });
 };

//  exports.modifySauce = (req, res, next) => {
//   const sauceObject = req.file ? {
//       ...JSON.parse(req.body.sauce),
//       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//   } : { ...req.body };


//   delete sauceObject._userId;
//   Sauce.findOne({_id: req.params.id})
//       .then((sauce) => {
//           if (sauce.userId != req.auth.userId) {
//               res.status(401).json({ message : 'Not authorized'});
//           } else {
//               Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
//               .then(() => res.status(200).json({message : 'Objet modifié!'}))
//               .catch(error => res.status(401).json({ error }));
//           }
//       })
//       .catch((error) => {
//           res.status(400).json({ error });
//       });
// };


  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
        if(sauce.userId != req.auth.userId) {
          res.status(401).json({message: 'Non autorisé'});
        } else {
          const filename = sauce.imageUrl.split('/images')[1];
          fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({_id: req.params.id})
              .then(() => { res.status(200).json({ message: 'Objet supprimé'})})
              .catch(error => { res.status(401).json({ error })})
          })
        }
      })
      .catch(error => {
        res.status(500).json({ error })
      });
  };

  exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json(error));
  };

  exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  };

 