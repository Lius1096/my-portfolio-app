import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Mon Portfolio. Tous droits réservés.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="https://github.com/ton-compte" className="hover:text-gray-400">GitHub</a>
          <a href="https://linkedin.com/in/ton-compte" className="hover:text-gray-400">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
