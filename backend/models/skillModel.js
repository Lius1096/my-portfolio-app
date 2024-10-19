// models/skill.js
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    icon: String, // URL de l'icône
    apiUrl: String // URL de l'API pour obtenir plus d'informations
});

module.exports = mongoose.model('Skill', skillSchema);
