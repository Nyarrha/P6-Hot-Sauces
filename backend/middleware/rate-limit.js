// Importation module
const rateLimit = require('express-rate-limit');

// Création limiteur de tentatives
const login = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limite le nombre de tentatives d'entrée à 10 toutes les 15mn
	standardHeaders: true,
	legacyHeaders: false,
    message: 'Tentatives de connexion dépassées'
})

// Exportation limiteur
module.exports = {login}