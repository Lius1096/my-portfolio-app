import React from 'react';
import logo from '../asset/logok.jpeg'; // ou '../assets/logo.png' selon l'emplacement

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto text-center">
        {/* Section pour le logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-10" /> {/* Ajustez la hauteur si nécessaire */}
        </div>

        <p className="text-sm mb-2">&copy; {new Date().getFullYear()} Mon Portfolio. Tous droits réservés.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="https://github.com/ton-compte" className="hover:text-gray-400">GitHub</a>
          <a href="https://linkedin.com/in/ton-compte" className="hover:text-gray-400">LinkedIn</a>
          <a href="/faq" className="hover:text-gray-400">FAQ</a>
          <a href="/privacy-policy" className="hover:text-gray-400">Politique de Confidentialité</a>
          <a href="/terms-of-service" className="hover:text-gray-400">Conditions d'Utilisation</a>
        </div>
        <div className="mt-4 text-xs">
          <p>Ce site utilise des cookies pour améliorer l'expérience utilisateur. En poursuivant votre navigation, vous acceptez notre <a href="/privacy-policy" className="text-gray-400 hover:underline">politique de confidentialité</a>.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
