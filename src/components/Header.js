import React, { useEffect, useState } from 'react';
import logo from '../asset/logok.jpeg'; // Assurez-vous que le chemin est correct

const Home = () => {
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Contrôle de la visibilité de la barre de navigation
      if (scrollTop > lastScrollTop) {
        setIsVisible(false); // Cacher la barre si on défile vers le bas
      } else {
        setIsVisible(true); // Montrer la barre si on défile vers le haut
      }

      // Contrôle de la visibilité du bouton "Retour en haut"
      if (scrollTop > 300) {
        setShowTopButton(true); // Montrer le bouton après 300px de scroll
      } else {
        setShowTopButton(false); // Cacher le bouton sinon
      }

      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  // Fonction pour retourner en haut de la page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className={`bg-primary text-white py-4 shadow-lg sticky top-0 z-50 transition-transform duration-300 ${isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="bg-white rounded-full p-1 shadow-md"> {/* Conteneur avec ombre légère */}
            <img src={logo} alt="KETE" className="h-10 w-10 rounded-full" /> {/* Logo avec classes rondes */}
          </div>
          
          <nav>
            <ul className="flex space-x-6">
              <li><a href="home" className="hover:text-accent transition">Accueil</a></li>
              <li><a href="#about" className="hover:text-accent transition">À propos</a></li>
              <li><a href="#expertises" className="hover:text-accent transition">Expertises</a></li>
              <li><a href="#portfolio" className="hover:text-accent transition">Portfolio</a></li>
              <li><a href="#skills" className="hover:text-accent transition">Compétences</a></li>
              <li><a href="#reviews" className="hover:text-accent transition">Avis</a></li>
              <li><a href="#contact" className="hover:text-accent transition">Contact</a></li>
              <li><a href="login" className="hover:text-accent transition">Connexion</a></li>
              <li><a href="signup" className="hover:text-accent transition">Inscription</a></li>
              <li><a href="admindashboard" className="hover:text-accent transition">Admin</a></li>
              <li><a href="userdashboard" className="hover:text-accent transition">User</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      {/* Bouton "Retour en haut" */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-accent text-white p-3 rounded-full shadow-lg hover:bg-accent-dark transition"
        >
          ↑
        </button>
      )}
    </>
  );
};

export default Home;
