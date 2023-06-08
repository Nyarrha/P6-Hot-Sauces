// Importation modules et model user
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Création/exportation fonction inscription utilisateur
exports.signup = (req, res, next) => {
    // Hache la valeur mot de passe entrée par l'utilisateur
    bcrypt.hash(req.body.password, 10)
    // Puis crée un utilisateur à partir des données sécurisées
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        // Enregistre l'utilisateur + traitement cas erreur
        user.save()
        .then(()=> res.status(201).json({ message: 'Utilisateur créé !'}))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
};

// Création/exportation fonction connexion utilisateur
exports.login = (req, res, next) => {
    // Compare adresse email entrée avec celles déjà existantes
    User.findOne({email: req.body.email})
    .then(user => {
        // Si valeur user inexistante : renvoyer erreur login
        if(user === null) {
            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte'})
        // Sinon : comparer mot de passe entré avec mot de passe associé à l'utilisateur
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                // Si mot de passe différent : erreur login
                if(!valid) {
                    return res.status(401).json({ message: 'Paire identifiant/mot de passe incorrect'})
                // Sinon, attribuer token vérifié et unique de connexion valide 24h
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_SECRET_KEY,
                            { expiresIn: '24h'}
                        )
                    });
                }
            })
            .catch(error => res.status(500).json({ error }))
        }
    })
    .catch(error => res.status(500).json({ error }));
}