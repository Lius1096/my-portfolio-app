const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
   
  title: String,
  description: String,
  image: String,
  website: String
});

module.exports = mongoose.model('Project', projectSchema);
