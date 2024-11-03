# Utilisez l'image officielle de Node.js avec la version nécessaire
FROM node:20.11.1

# Créez et définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le fichier package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste du code source dans le conteneur
COPY . .

# Construisez l'application pour la production (ou démarrez-la en dev selon vos besoins)
RUN npm run build

# Exposez le port de votre application (changez selon vos besoins)
EXPOSE 5000

# Commande pour lancer l'application
CMD ["npm", "start"]
