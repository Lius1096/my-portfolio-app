const fs = require('fs');

// Charger la configuration à partir de config.json
let config = {};
try {
    config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
} catch (error) {
    console.error('Erreur lors du chargement de config.json:', error);
    process.exit(1); // Arrête l'application si le chargement échoue
}

// Exporter les configurations
module.exports = {
    PORT: process.env.PORT || config.PORT,
    SECRET_KEY: process.env.SECRET_KEY || config.SECRET_KEY,
    MONGODB_URI: process.env.MONGODB_URI || config.MONGODB_URI,
    EMAIL: process.env.EMAIL || config.EMAIL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || config.EMAIL_PASSWORD,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || config.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || config.GOOGLE_CLIENT_SECRET,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || config.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET || config.FACEBOOK_CLIENT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET || config.SESSION_SECRET
};
