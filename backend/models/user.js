// Importation modules
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Création schéma utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
})

// Association du module mongoose-unique-validateur au schéma
userSchema.plugin(uniqueValidator);

// Exportation schéma
module.exports = mongoose.model('User', userSchema);