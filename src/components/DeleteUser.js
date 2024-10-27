import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteUser = () => {
  const [error, setError] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté pour supprimer votre compte.');
      return;
    }

    if (confirmationText !== 'DELETE') {
      setError('Veuillez entrer le texte "DELETE" pour confirmer la suppression.');
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/user-data', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression de l'utilisateur");

      setSuccessMessage('Compte supprimé avec succès');
      localStorage.removeItem('token'); // Supprime le token du stockage local
      setTimeout(() => navigate('/goodbye'), 2000); // Redirige vers la page Goodbye après 2 secondes
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Supprimer le compte</h2>
      <p className="text-gray-600 mb-4">
        Pour confirmer la suppression de votre compte, veuillez entrer le texte "DELETE" ci-dessous.
      </p>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      
      <input
        type="text"
        placeholder="Entrez 'DELETE' pour confirmer"
        value={confirmationText}
        onChange={(e) => setConfirmationText(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />
      
      <button
        onClick={handleDelete}
        disabled={confirmationText !== 'DELETE'}
        className={`py-2 px-4 rounded ${
          confirmationText === 'DELETE' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Supprimer mon compte
      </button>
    </div>
  );
};

export default DeleteUser;
