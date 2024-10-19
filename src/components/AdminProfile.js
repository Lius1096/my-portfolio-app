import React, { useState, useEffect } from 'react';

const AdminProfile = () => {
  const [adminData, setAdminData] = useState({ username: '', email: '' });
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch admin data from the backend
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/admin', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAdminData(data);
      setFormData(data); // Pré-remplir le formulaire avec les données existantes
    };

    fetchAdminData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5000/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setAdminData(updatedData); // Met à jour les données de l'admin
        setMessage('Profil mis à jour avec succès.');
        setEditMode(false); // Quitter le mode édition
      } else {
        setMessage('Erreur lors de la mise à jour du profil.');
      }
    } catch (error) {
      setMessage('Erreur serveur.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">Profil de l'Admin</h2>
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Enregistrer les modifications
          </button>
          <button
            type="button"
            className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 ml-4"
            onClick={() => setEditMode(false)}
          >
            Annuler
          </button>
        </form>
      ) : (
        <div>
          <p><strong>Nom d'utilisateur:</strong> {adminData.username}</p>
          <p><strong>Email:</strong> {adminData.email}</p>
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={() => setEditMode(true)}
          >
            Modifier le profil
          </button>
        </div>
      )}
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default AdminProfile;
