import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';

const GoogleAuth = () => {
  const navigate = useNavigate(); // Hook pour la redirection

  // Fonction pour gérer la connexion réussie via Google
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
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error);
    }
  };

  // Fonction en cas d'échec de la connexion
  const handleFailure = (error) => {
    console.error('Erreur lors de la connexion Google:', error);
  };

  return (
    <div>
      <h2>Se connecter avec Google</h2>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID} // Remplacez par votre ID Client Google
        buttonText="Login with Google"
        onSuccess={handleGoogleLogin} // Appel en cas de succès
        onFailure={handleFailure}    // Appel en cas d'échec
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default GoogleAuth;
