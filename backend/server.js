// Importation des modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); // Assure-toi d'importer body-parser
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const csrf = require('csurf');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
require('dotenv').config(); // Chargement des variables d'environnement
// Si authenticateToken est dans un autre fichier


// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'build')));

// Renvoyer index.html pour toutes les routes non gérées
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Chargement de la configuration
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Initialisation de l'application Express
const app = express();

// Configuration des constantes
const port = config.PORT;
const SESSION_SECRET = config.SESSION_SECRET;
const SECRET_KEY = process.env.SECRET_KEY || 'votre_clé_secrète'; // Clé secrète dans les variables d'environnement

// Connexion à MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Autorise seulement ton frontend
    credentials: true, // Permet d'envoyer les cookies et les en-têtes d'authentification
}));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '100mb' })); // Par exemple, 10 Mo
app.use(bodyParser.urlencoded({ limit: '10Omb', extended: true }));

const checkAdmin = (req, res, next) => {
    // Supposons que vous ayez les informations sur l'utilisateur dans le token JWT
    if (req.user && req.user.role === 'admin') {
        next(); // L'utilisateur est un administrateur, continuez à la prochaine middleware
    } else {
        return res.status(403).json({ message: 'Accès interdit' }); // L'utilisateur n'est pas autorisé
    }
};



// Middleware de session
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Initialiser Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour servir des fichiers statiques depuis le dossier 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Middleware pour authentifier et autoriser les utilisateurs
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Récupère le token après "Bearer"

    if (!token) {
        return res.status(401).json({ error: 'Token manquant ou invalide' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide' });
        }
        req.user = user; // Attache l'utilisateur vérifié à l'objet req
        next(); // Poursuit l'exécution
    });
};

const validateSignup = (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    // Ajoutez d'autres validations si nécessaire (format d'email, longueur de mot de passe, etc.)

    next();
};



// Modèle Mongoose pour les utilisateurs
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Champ pour l'email
    username: { type: String, required: true, unique: true }, // Champ pour le nom d'utilisateur
    password: { type: String }, // Champ pour le mot de passe
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Rôle de l'utilisateur
    profilePicture: { type: String }, // Champ pour l'image de profil
    resetPasswordToken: { type: String }, // Token pour réinitialiser le mot de passe
    resetPasswordExpires: { type: Date }, // Date d'expiration du token
    googleId: { type: String } // Champ pour stocker l'ID Google
});


const User = mongoose.model('User', userSchema);

// Modèle Mongoose pour les projets
const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    website: { type: String, required: true }
});

const Project = mongoose.model('Project', projectSchema);

// Modèle Mongoose pour les contacts
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Modèle Mongoose pour les avis
const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

// Modèle Mongoose pour les compétences
const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    icon: String,
    apiUrl: String
});

const Skill = mongoose.model('Skill', skillSchema);

// Modèle Mongoose pour les expertises
const expertiseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true }
});

const Expertise = mongoose.model('Expertise', expertiseSchema);


// Route pour obtenir les informations utilisateur
// Route protégée
app.get('/user-data', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Assurez-vous que vous avez accès à la base de données
        if (!user) return res.sendStatus(404); // Utilisateur non trouvé

        // Renvoie les données utilisateur
        res.json({
            username: user.username,
            email: user.email,
            profilePicture: `http://localhost:5000/${user.profilePicture}`, // Utilisez le chemin correct
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des données utilisateur');
    }
});
  

// Routes CRUD pour les contacts
app.get('/contacts', authenticateJWT, async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des contacts' });
    }
});

app.post('/contacts', async (req, res) => {
    console.log('Données reçues:', req.body); // Vérifier les données reçues

    const { name, email, message } = req.body;
    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        res.status(201).json({ message: 'Message envoyé avec succès !' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du contact:', error);
        res.status(500).json({ error: 'Erreur lors de l\'enregistrement du contact' });
    }
});

app.put('/contacts/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { name, email, message } = req.body;
    try {
        const updatedContact = await Contact.findByIdAndUpdate(id, { name, email, message }, { new: true });
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du contact' });
    }
});

app.delete('/contacts/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        await Contact.findByIdAndDelete(id);
        res.status(200).json({ message: 'Contact supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du contact' });
    }
});

// Routes CRUD pour les avis
app.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des avis' });
    }
});

app.post('/reviews', async (req, res) => {
    const { name, rating, comment } = req.body;
    try {
        const newReview = new Review({ name, rating, comment });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'avis' });
    }
});

app.put('/reviews/:id', async (req, res) => {
    const { id } = req.params;
    const { name, rating, comment } = req.body;
    try {
        const updatedReview = await Review.findByIdAndUpdate(id, { name, rating, comment }, { new: true });
        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'avis' });
    }
});

app.delete('/reviews/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Review.findByIdAndDelete(id);
        res.status(200).json({ message: 'Avis supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'avis' });
    }
});

// Routes CRUD pour les compétences
app.get('/skills', async (req, res) => {
    try {
        const skills = await Skill.find();
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des compétences' });
    }
});

app.post('/skills', async (req, res) => {
    const { name, description, icon, apiUrl } = req.body;
    try {
        const newSkill = new Skill({ name, description, icon, apiUrl });
        await newSkill.save();
        res.status(201).json(newSkill);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la compétence' });
    }
});

app.put('/skills/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, icon, apiUrl } = req.body;
    try {
        const updatedSkill = await Skill.findByIdAndUpdate(id, { name, description, icon, apiUrl }, { new: true });
        res.status(200).json(updatedSkill);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la compétence' });
    }
});

app.delete('/skills/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Skill.findByIdAndDelete(id);
        res.status(200).json({ message: 'Compétence supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la compétence' });
    }
});

// Routes CRUD pour les expertises
app.get('/expertises', async (req, res) => {
    try {
        const expertises = await Expertise.find();
        res.status(200).json(expertises);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des expertises' });
    }
});

app.post('/expertises', async (req, res) => {
    const { title, description } = req.body;
    try {
        const newExpertise = new Expertise({ title, description });
        await newExpertise.save();
        res.status(201).json(newExpertise);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'expertise' });
    }
});

app.put('/expertises/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const updatedExpertise = await Expertise.findByIdAndUpdate(id, { title, description }, { new: true });
        res.status(200).json(updatedExpertise);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'expertise' });
    }
});

app.delete('/expertises/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Expertise.findByIdAndDelete(id);
        res.status(200).json({ message: 'Expertise supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'expertise' });
    }
});

// Routes d'authentification
app.post('/signup', validateSignup, async (req, res) => {
    const { username, email, password, role } = req.body; // On ajoute le rôle ici
    if (!email) {
        return res.status(400).json({ error: 'L\'email est requis' });
    }
    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }

        // Hashage du mot de passe avec bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'  // Par défaut, le rôle est 'user' si aucun rôle n'est fourni
        });

        // Sauvegarder l'utilisateur dans la base de données
        await newUser.save();

        // Générer un token JWT pour l'utilisateur
        const token = jwt.sign({ id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role }, SECRET_KEY, { expiresIn: '1h' });

        // Envoyer une réponse avec le token
        res.status(201).json({ message: 'Utilisateur créé avec succès', token });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
});



app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({ token }); // Renvoie le token au client
    }
    res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
});

const multer = require('multer'); // Assurez-vous que multer est requis en haut du fichier

// Configuration de multer pour le téléchargement de fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Assurez-vous que ce dossier existe
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Ajout d'un timestamp pour éviter les conflits de noms
    },
  });



// Initialisation de multer avec vérification du type de fichier
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      // Accepter uniquement les fichiers image, PDF et Word
      const acceptedMimeTypes = [
        'image/jpeg',  // JPEG
        'image/jpg',  // JPG
        'image/png',   // PNG
        'application/pdf', // PDF
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'application/msword' // DOC
      ];
  
      if (acceptedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Le fichier doit être une image (JPEG ou PNG), un PDF ou un document Word (DOCX ou DOC)'));
      }
    },
  });
  
  
  // Route pour uploader un fichier
  app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
      res.send('Fichier uploadé avec succès');
    } else {
      res.status(400).send('Erreur lors du téléchargement du fichier');
    }
  });

  
  // Route pour mettre à jour le profil utilisateur
app.put('/update-profile', authenticateJWT, upload.single('profilePicture'), async (req, res) => {
    const { username, email } = req.body;
    const userId = req.user.id; // Récupère l'ID de l'utilisateur à partir du token
  
    // Préparez les données à mettre à jour
    const updateData = { username, email };
  
    // Ajoutez la photo de profil si elle a été téléchargée
    if (req.file) {
      // Utilisez le chemin relatif pour accéder au fichier
      updateData.profilePicture = req.file.path; // Stocke le chemin de la photo de profil téléchargée
    }
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true } // Renvoie le document mis à jour
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
    }
  });
  
// Route de déconnexion
app.post('/logout', (req, res) => {
    res.clearCookie('token'); // Efface le cookie de session
    res.status(200).json({ message: 'Déconnexion réussie' }); // Renvoie une réponse de succès
});

// Utilisation du middleware pour protéger la route dashboard
app.get('/userdashboard', authenticateJWT, (req, res) => {
    res.json({ message: 'Bienvenue sur le tableau de bord sécurisé !' });
  });



// Récupérer tous les projets
app.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des projets', details: error.message });
    }
});

// Créer un nouveau projet
app.post('/projects', upload.single('image'), async (req, res) => {
    const { title, description, website } = req.body;
    if (req.file) {
        res.send('Fichier uploadé avec succès');
      } else {
        res.status(400).send('Erreur lors du téléchargement du fichier');
      }
    // Validation des données
    if (!title || !description) {
        return res.status(400).json({ error: 'Titre et description sont requis.' });
    }

    try {
        const newProject = new Project({ title, description, image, website });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du projet', details: error.message });
    }
});

// Mettre à jour un projet
app.put('/projects/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, description, website } = req.body;
    const image = req.file ? req.file.path : null; // Chemin de l'image

    try {
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { title, description, image, website },
            { new: true, runValidators: true } // Valider les champs lors de la mise à jour
        );

        if (!updatedProject) {
            return res.status(404).json({ error: 'Projet non trouvé' });
        }

        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du projet', details: error.message });
    }
});

// Supprimer un projet
app.delete('/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProject = await Project.findByIdAndDelete(id);
        
        if (!deletedProject) {
            return res.status(404).json({ error: 'Projet non trouvé' });
        }

        res.status(200).json({ message: 'Projet supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du projet', details: error.message });
    }
});




// Route GET pour récupérer les informations de l'admin
app.get('/admin', authenticateJWT, async (req, res) => {
    try {
        const admin = await User.findById(req.user.id); // Trouver l'admin par l'ID dans le token
        if (admin.role !== 'admin') {
            return res.status(403).json({ message: 'Accès non autorisé.' });
        }
        res.json({ username: admin.username, email: admin.email });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

  
  // Route PUT pour mettre à jour les informations de l'admin
app.put('/admin', authenticateJWT, async (req, res) => {
    const { username, email } = req.body;
    
    try {
        const admin = await User.findById(req.user.id); // Vérifier que l'utilisateur est bien l'admin
        if (admin.role !== 'admin') {
            return res.status(403).json({ message: 'Accès non autorisé.' });
        }

        // Mise à jour des informations
        admin.username = username || admin.username;
        admin.email = email || admin.email;
        await admin.save();

        res.json({ message: 'Profil mis à jour avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route DELETE pour supprimer le compte admin
app.delete('/admin', authenticateJWT, async (req, res) => {
    try {
        const admin = await User.findById(req.user.id); 
        if (admin.role !== 'admin') {
            return res.status(403).json({ message: 'Accès non autorisé.' });
        }

        await User.findByIdAndDelete(req.user.id); // Supprimer l'admin

        res.json({ message: 'Compte supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

  
  

// Route de déconnexion
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Déconnexion réussie' });
});


// Middleware pour les cookies et le parsing JSON
app.use(cookieParser());
app.use(express.json());


// Récupérer tous les utilisateurs
app.get('/users', authenticateJWT, async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Ne pas inclure le mot de passe
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs', details: error.message });
    }
});

// Récupérer un utilisateur par son ID
app.get('/users/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select('-password'); // Ne pas inclure le mot de passe
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur', details: error.message });
    }
});

// Créer un nouvel utilisateur
app.post('/users', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur', details: error.message });
    }
});

// Mettre à jour un utilisateur
app.put('/users/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { username, email, password }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur', details: error.message });
    }
});

// Supprimer un utilisateur
app.delete('/users/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        
        if (!deletedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur', details: error.message });
    }
});
// Les routes pour gérer les projets existent déjà, vous pouvez les utiliser ici dans le dashboard.
app.get('/admin/projects', authenticateJWT, checkAdmin, async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des projets' });
    }
});


app.get('/admin/contacts', authenticateJWT, checkAdmin, async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des contacts' });
    }
});

app.delete('/admin/contacts/:id', authenticateJWT, checkAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await Contact.findByIdAndDelete(id);
        res.status(200).json({ message: 'Contact supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du contact' });
    }
});


// Récupérer tous les avis
app.get('/admin/reviews', authenticateJWT, checkAdmin, async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des avis' });
    }
});

// Supprimer un avis
app.delete('/admin/reviews/:id', authenticateJWT, checkAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await Review.findByIdAndDelete(id);
        res.status(200).json({ message: 'Avis supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'avis' });
    }
});


// Gestion des compétences
app.get('/admin/skills', authenticateJWT, checkAdmin, async (req, res) => {
    try {
        const skills = await Skill.find();
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des compétences' });
    }
});

// Gestion des expertises
app.get('/admin/expertises', authenticateJWT, checkAdmin, async (req, res) => {
    try {
        const expertises = await Expertise.find();
        res.status(200).json(expertises);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des expertises' });
    }
});

// Middleware pour mettre à jour le profil de l'administrateur
app.put('/admin-update-profile', authenticateJWT, checkAdmin, async (req, res) => {
    const { username, email, profilePicture, password } = req.body;

    try {
        // Vérifiez que l'utilisateur existe
        const adminUser = await User.findById(req.user.id); // Vous devez stocker l'ID de l'utilisateur dans le token JWT

        if (!adminUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Mettez à jour les informations de l'utilisateur
        if (username) adminUser.username = username;
        if (email) adminUser.email = email;
        if (profilePicture) adminUser.profilePicture = profilePicture;

        // Si le mot de passe est fourni, hachez-le et mettez-le à jour
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            adminUser.password = hashedPassword; // Remplacez le mot de passe par le nouveau haché
        }

        // Enregistrez les modifications dans la base de données
        await adminUser.save();

        res.json({ message: 'Profil mis à jour avec succès', user: adminUser });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil :', error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});




// Configurer le middleware CSRF (l'option { cookie: true } utilise des cookies pour stocker le token)
const csrfProtection = csrf({ cookie: true });

// Middleware pour créer des tokens CSRF
app.get('/csrf-token', csrfProtection, (req, res) => {
    // Le token CSRF est accessible via req.csrfToken()
    res.cookie('XSRF-TOKEN', req.csrfToken(), { httpOnly: false, secure: true, sameSite: 'Strict' });
    res.status(200).json({ csrfToken: req.csrfToken() });
});

// Routes protégées par le middleware CSRF
app.post('/secure-endpoint', csrfProtection, (req, res) => {
    // Requêtes sécurisées contre les attaques CSRF
    res.status(200).json({ message: 'Requête sécurisée' });
});


// Fonction pour envoyer l'email
const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail, outlook', // Ou un autre service
        auth: {
            user: process.env.EMAIL_USER, // Ton email
            pass: process.env.EMAIL_PASS // Ton mot de passe ou token d'application
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    });
};

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;


    // Vérifie si l'email est fourni
    if (!email) {
        return res.status(400).json({ error: 'Email est requis' });
    }

    console.log('Email reçu:', email); // Debugging
    // Vérifier si l'utilisateur avec cet email existe
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Sauvegarder le token avec une durée d'expiration
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();

    // Configurer le transporteur nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // Ton adresse email
            pass: process.env.EMAIL_PASSWORD // Ton mot de passe ou App Password
        }
    });

    // Envoyer l'email de réinitialisation
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Réinitialisation du mot de passe',
        text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Un lien de réinitialisation a été envoyé à votre adresse email.' });



});

app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    console.log('Token reçu:', token); // Debugging
    console.log('Nouveau mot de passe reçu:', newPassword); // Debugging

    // Vérifier le token et son expiration
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
        return res.status(400).json({ error: 'Token invalide ou expiré' });
    }

    // Hachage du nouveau mot de passe
    user.password = await bcrypt.hash(newPassword, 10);

    // Réinitialiser le token et l'expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
});

//const { OAuth2Client } = require('google-auth-library');
//const client = new OAuth2Client(CLIENT_ID);


/*============connexion via facebook et google==================

async function verifyFacebookToken(token) {
  const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
  const data = await response.json();
  if (data.id) {
    // L'identifiant utilisateur Facebook est dans data.id
  }
}
*/

// Serialiser et déserialiser l'utilisateur
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Stratégie Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {

        
        // Trouver ou créer l'utilisateur dans la base de données
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // Si l'utilisateur n'existe pas, le créer
            user = await new User({
                googleId: profile.id,
                email: profile.emails[0].value, // Utilisez l'email fourni par Google
                username: profile.displayName, // Nom d'utilisateur de Google
            }).save();
        }
        // Créer un JWT après que l'utilisateur soit authentifié
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        done(null, { user, token }); // Passer l'utilisateur et le token
    } catch (error) {
        console.error('Erreur lors de la gestion de l\'utilisateur:', error);
        return done(error);
    }
}));

/*Stratégie Facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name'],
}, (accessToken, refreshToken, profile, done) => {
    // Gérer l'utilisateur ici
    console.log('Profil Facebook :', profile);
    return done(null, profile);
}));*/


// Route de connexion Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


// Route de callback Google

app.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    // Si l'authentification est réussie, vous pouvez obtenir le token et l'utilisateur
    const token = req.user.token; // Récupérer le token depuis la requête

    // Rediriger l'utilisateur vers le tableau de bord avec le token
    res.redirect(`http://localhost:3000/userdashboard?token=${token}`); // Remplacez par l'URL de votre tableau de bord
});


// Routes Facebook OAuth
app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => {
        // Connexion réussie
        res.redirect('/success');
    }
);

// Route de succès
app.get('/success', (req, res) => {
    res.send('Connexion réussie !');
});
  

// Création du modèle de données
const projectRequestSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  projectDescription: { type: String, required: true },
  budget: { type: String, required: true },
  timeline: { type: String, required: true },
  contactMethod: { type: String, required: true },
  additionalNotes: { type: String, required: false },
  projectFile: { type: String, required: false }, // URL ou chemin du fichier
}, {
  timestamps: true,
});

// Création du modèle basé sur le schéma
const ProjectRequest = mongoose.model('ProjectRequest', projectRequestSchema);

// Route pour soumettre une demande de projet
app.post('/project-requests', upload.single('projectFile'), async (req, res) => {
  try {
    // Log pour vérifier ce que vous recevez
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const projectRequestData = {
      projectName: req.body.projectName,
      projectDescription: req.body.projectDescription,
      budget: req.body.budget,
      timeline: req.body.timeline,
      contactMethod: req.body.contactMethod,
      additionalNotes: req.body.additionalNotes,
      projectFile: req.file ? req.file.path : null, 
    };

    console.log("Données de la demande de projet à insérer:", projectRequestData); // Log pour déboguer

    // Route pour obtenir les demandes de projet de l'utilisateur
app.get('/project-requests', authenticateJWT, async (req, res) => {
  try {
    // Récupérer les demandes de projet pour l'utilisateur connecté
    const requests = await ProjectRequest.find({ userId: req.userId });
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des demandes de projet' });
  }
});

// Route pour mettre à jour une demande de projet
app.put('/project-requests/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { projectName, projectDescription, budget, timeline, contactMethod, additionalNotes, projectFile } = req.body;

  try {
    // Vérifier que la demande de projet appartient à l'utilisateur
    const request = await ProjectRequest.findOne({ _id: id, userId: req.userId });
    if (!request) {
      return res.status(404).json({ error: 'Demande de projet non trouvée ou non autorisée' });
    }

    // Mettre à jour la demande de projet
    request.projectName = projectName;
    request.projectDescription = projectDescription;
    request.budget = budget;
    request.timeline = timeline;
    request.contactMethod = contactMethod;
    request.additionalNotes = additionalNotes;
    request.projectFile = projectFile;

    await request.save();
    res.status(200).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la demande de projet' });
  }
});

// Route pour supprimer une demande de projet
app.delete('/project-requests/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifier que la demande de projet appartient à l'utilisateur
    const deletedRequest = await ProjectRequest.findOneAndDelete({ _id: id, userId: req.userId });
    if (!deletedRequest) {
      return res.status(404).json({ error: 'Demande de projet non trouvée ou non autorisée' });
    }
    res.status(200).json({ message: 'Demande de projet supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la demande de projet' });
  }
});
    const projectRequest = new ProjectRequest(projectRequestData);
    await projectRequest.save();

    res.status(201).json({ message: 'Demande de projet soumise avec succès', projectRequest });
  } catch (error) {
    console.error(error); // Log de l'erreur
    res.status(500).json({ message: 'Erreur lors de la soumission de la demande de projet', error });
  }
});

// Route pour récupérer les données utilisateur (profil admin)
app.get('/admin-user-profile', authenticateJWT, async (req, res) => {
    try {
      const user = await User.findById(req.user.id); // Utiliser l'ID de l'utilisateur depuis le token
      if (!user) return res.status(404).send('Utilisateur non trouvé.');
      res.json(user);
    } catch (error) {
      res.status(500).send('Erreur lors de la récupération des données.');
    }
  });
  
  // Route pour mettre à jour les données utilisateur (profil admin)
  app.put('/admin-user-profile', authenticateJWT, upload.single('profilePicture'), async (req, res) => {
    try {
      const { username, email } = req.body;
      const updatedData = { username, email };
  
      // Si une nouvelle image est téléchargée
      if (req.file) {
        updatedData.profilePicture = req.file.path; // Enregistrer le chemin de l'image
      }
  
      const user = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });
      if (!user) return res.status(404).send('Utilisateur non trouvé.');
  
      res.json(user);
    } catch (error) {
      res.status(500).send('Erreur lors de la mise à jour des données.');
    }
  });

  
// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


