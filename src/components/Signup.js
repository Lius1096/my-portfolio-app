import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


import { FaGoogle, FaFacebook } from 'react-icons/fa'; // Import des icônes Google et Facebook
//=========route connexion facebook===========================
<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"></script>

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // État pour le rôle (utilisateur ou admin)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Utilisez useNavigate pour la redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
        }),
      });

      const data = await response.json(); // Récupérer la réponse JSON même en cas d'erreur

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      // Stockez le token JWT après l'inscription réussie
      localStorage.setItem('token', data.token); // Stockez le token dans localStorage

      setSuccess(true);
      navigate('/userdashboard');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('user'); // Réinitialiser le rôle après l'inscription
    } catch (error) {
      setError(error.message || "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const res = await fetch('http://localhost:5000/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.tokenId, // le token Google envoyé au serveur
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la connexion avec Google');
      }
  
      // Stocker le token JWT reçu du serveur
      localStorage.setItem('token', data.token);
  
      // Rediriger vers le dashboard
      navigate('/userdashboard');
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error);
    }
  };
  


  const handleGoogleSignup = () => {
    // Logique pour inscription via Google
    window.location.href = 'http://localhost:5000/auth/google';
  };

  

  const handleFacebookSignup = () => {
    // Logique pour inscription via Facebook
    window.location.href = 'http://localhost:5000/auth/facebook';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Inscription</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">Inscription réussie ! Vous pouvez maintenant vous connecter.</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          {/* Ajout de l'option pour le rôle */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rôle</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          {/* Bouton d'inscription */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isSubmitting ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        {/* Options d'inscription avec Google ou Facebook */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleGoogleSignup}
            className="flex items-center justify-center w-full bg-red-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-red-600"
          >
            <FaGoogle className="mr-2" />

          </button>
          <button
            onClick={handleFacebookSignup}
            className="flex items-center justify-center w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            <FaFacebook className="mr-2" />

          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
