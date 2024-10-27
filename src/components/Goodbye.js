import React from 'react';
import { Link } from 'react-router-dom';
import goodbyeImage from '../asset/connexion.jpg'; // Assurez-vous que le chemin est correct

const Goodbye = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
        <img
          src={goodbyeImage}
          alt="Au revoir"
          className="mb-4 w-32 h-32 object-cover rounded-full mx-auto"
        />
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Au revoir !</h2>
        <p className="text-gray-600 mb-4">Nous espérons vous revoir bientôt.</p>
        <p className="text-gray-600 mb-6">Vous pouvez toujours créer un compte.</p>
        <Link
          to="/signup"
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
          Créer un compte
        </Link>
      </div>
    </div>
  );
};

export default Goodbye;
