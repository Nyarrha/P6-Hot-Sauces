// Importation module
var passwordValidator = require('password-validator');

// Création schéma de validateur
var schema = new passwordValidator();

// Configuration paramètres du validateur
schema
.is().min(8)                                    // Au moins 8 caractères
.is().max(16)                                  // Maximum 16 caractères
.has().uppercase(2)                              // Doit contenir au minimum 2 majuscules
.has().lowercase()                              // Doit contenir des minuscules
.has().digits(2)                                // Doit contenir au minimum 2 chiffres
.has().not().spaces()                           // Ne doit pas contenir d'espace
.is().not().oneOf(['Passw0rD1', 'PassworD123', 'PAssw0rd123', 'AdmiN123']); // Exemples de mots de passe blacklist(valides mais jugés "trop faibles")


// Exportation du validateur
module.exports = (req, res, next) => {
    // Si le MDP user remplit les conditions : continuer
    if(schema.validate(req.body.password)){
        next();
    // Sinon : renvoi erreur
    } else {
        return res.status(401).json({
            error: `Votre mot de passe doit remplir ces critères : ${schema.validate(req.body.password, { list: true })}`
        })
    }
}