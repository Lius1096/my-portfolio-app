import React, { useState, useEffect } from 'react';

const MesDemandes = () => {
  const [demandes, setDemandes] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    budget: '',
    timeline: '',
    contactMethod: '',
    additionalNotes: '',
    projectFile: '',
  });

  // Fonction pour récupérer toutes les demandes de l'utilisateur
  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const response = await fetch('http://localhost:5000/project-requests', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Si vous utilisez JWT pour l'authentification
          },
        });
        const data = await response.json();
        setDemandes(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
      }
    };

    fetchDemandes();
  }, []);

  // Fonction pour supprimer une demande
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/project-requests/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Authentification
        },
      });

      if (response.ok) {
        setDemandes(demandes.filter((demande) => demande._id !== id));
        setMessage('Demande supprimée avec succès.');
      } else {
        setMessage('Erreur lors de la suppression de la demande.');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Fonction pour sélectionner une demande pour modification
  const handleEdit = (demande) => {
    setSelectedRequest(demande);
    setFormData({
      projectName: demande.projectName,
      projectDescription: demande.projectDescription,
      budget: demande.budget,
      timeline: demande.timeline,
      contactMethod: demande.contactMethod,
      additionalNotes: demande.additionalNotes || '',
      projectFile: demande.projectFile || '',
    });
  };

  // Fonction pour gérer la soumission du formulaire de modification
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/project-requests/${selectedRequest._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Authentification
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedRequest = await response.json();
        setDemandes((prevDemandes) =>
          prevDemandes.map((demande) => (demande._id === updatedRequest._id ? updatedRequest : demande))
        );
        setMessage('Demande mise à jour avec succès.');
        setSelectedRequest(null);
        setFormData({
          projectName: '',
          projectDescription: '',
          budget: '',
          timeline: '',
          contactMethod: '',
          additionalNotes: '',
          projectFile: '',
        });
      } else {
        setMessage('Erreur lors de la mise à jour de la demande.');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Mes demandes de projet</h2>
      {message && <p className="text-green-600 mb-4">{message}</p>}

      {selectedRequest ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <h3 className="text-lg font-bold mb-2">Modifier la demande</h3>
          <input
            type="text"
            placeholder="Nom du projet"
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            required
            className="block w-full mb-2 border rounded p-2"
          />
          <textarea
            placeholder="Description du projet"
            value={formData.projectDescription}
            onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
            required
            className="block w-full mb-2 border rounded p-2"
          />
          <input
            type="text"
            placeholder="Budget"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            required
            className="block w-full mb-2 border rounded p-2"
          />
          <input
            type="text"
            placeholder="Délai"
            value={formData.timeline}
            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
            required
            className="block w-full mb-2 border rounded p-2"
          />
          <input
            type="text"
            placeholder="Méthode de contact"
            value={formData.contactMethod}
            onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
            required
            className="block w-full mb-2 border rounded p-2"
          />
          <textarea
            placeholder="Notes supplémentaires"
            value={formData.additionalNotes}
            onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
            className="block w-full mb-2 border rounded p-2"
          />
          <input
            type="text"
            placeholder="Fichier de projet (URL ou chemin)"
            value={formData.projectFile}
            onChange={(e) => setFormData({ ...formData, projectFile: e.target.value })}
            className="block w-full mb-2 border rounded p-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Mettre à jour la demande
          </button>
          <span
            onClick={() => setSelectedRequest(null)}
            className="text-gray-500 cursor-pointer hover:text-gray-700 ml-2"
          >
            Annuler
          </span>
        </form>
      ) : (
        <>
          {demandes.length > 0 ? (
            <ul>
              {demandes.map((demande) => (
                <li key={demande._id} className="border p-4 mb-4 rounded-md shadow-sm">
                  <h3 className="text-lg font-bold">{demande.projectName}</h3>
                  <p><strong>Budget :</strong> {demande.budget}</p>
                  <p><strong>Délai :</strong> {demande.timeline}</p>
                  <p><strong>Contact :</strong> {demande.contactMethod}</p>

                  <div className="mt-2 flex space-x-4">
                    <span
                      onClick={() => handleEdit(demande)}
                      className="text-yellow-500 cursor-pointer hover:text-yellow-600"
                    >
                      Modifier
                    </span>
                    <span
                      onClick={() => handleDelete(demande._id)}
                      className="text-red-500 cursor-pointer hover:text-red-600"
                    >
                      Supprimer
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucune demande soumise pour le moment.</p>
          )}
        </>
      )}
    </div>
  );
};

export default MesDemandes;
