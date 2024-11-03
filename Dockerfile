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

# Ajout des variables directement dans le Dockerfile
ENV PORT=5000 
ENV SECRET_KEY=7zKj!aZs3Pv92FShY2R0JQsDp1EX#9
ENV MONGODB_URI=mongodb://localhost:27017/portfolio 
ENV EMAIL=juliusdjossou@gmail.com 
ENV EMAIL_PASSWORD=guulxnsfrprxmjsj 
ENV GOOGLE_CLIENT_ID=292932120713-7do5rlcq0u9hrgvnkk2o1cad97nl0f4n.apps.googleusercontent.com 
ENV GOOGLE_CLIENT_SECRET=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 
ENV FACEBOOK_CLIENT_ID=your-facebook-client-id 
ENV FACEBOOK_CLIENT_SECRET=your-facebook-client-secret 
ENV SESSION_SECRET=a7b8d29318b3026330e56781c7b73b7c3990aa47ea42f89692b1803c1aeb3418 