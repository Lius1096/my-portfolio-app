// Schéma et modèle des expertises

const mongoose = require('mongoose');

const expertiseSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  });
  
  const Expertise = mongoose.model('Expertise', expertiseSchema);
  
