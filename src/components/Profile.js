import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profilePicture: null,
  });

  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email); // Add email to form data
    if (formData.profilePicture) {
      formDataToSend.append('profilePicture', formData.profilePicture);
    }

    try {
      const response = await fetch('http://localhost:5000/user-data', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour des données.');

      setIsEditing(false);
      fetchUserData(); // Refresh user data after submission
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Aucun token trouvé. Veuillez vous connecter.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/user-data', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Erreur lors de la récupération des données utilisateur.');

      const fetchedData = await response.json();
      setUserData(fetchedData);
      setFormData({ username: fetchedData.username, email: fetchedData.email, profilePicture: null });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex items-start bg-white p-6 rounded-lg shadow-lg">
      <div className="mr-6">
        {userData?.profilePicture ? (
          <img
            src={userData.profilePicture}
            alt="Photo de profil"
            className="w-24 h-24 rounded-full border border-gray-300 object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center text-gray-500">
            <span>Pas d'image</span>
          </div>
        )}
      </div>
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-4">Informations personnelles</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <p className="font-semibold text-lg">
            Nom d'utilisateur: <span className="font-normal">{userData?.username}</span>
          </p>
          <p className="font-semibold text-lg">
            Email: <span className="font-normal">{userData?.email}</span>
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 text-blue-500 hover:underline"
          >
            Modifier le profil
          </button>
        </div>

        {isEditing && (
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
              <label className="block text-gray-700">Email (non modifiable)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full p-2 border border-gray-300 rounded bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Changer la photo de profil</label>
              <input
                type="file"
                onChange={handlePhotoChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              Annuler
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
