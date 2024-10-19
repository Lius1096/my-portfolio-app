import React, { useState, useEffect } from 'react';
import ProjectRequestForm from './ProjectRequestForm';
import ForgotPassword from './ForgotPassword';
import MesDemandes from './MesDemandes';
import { FaPlus, FaTrashAlt, FaCamera, FaTimes, FaImage } from 'react-icons/fa';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [formData, setFormData] = useState({ username: '', email: '', profilePicture: null });

  const handlePasswordResetToggle = () => {
    setIsPasswordResetOpen(!isPasswordResetOpen);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Réinitialiser les données du formulaire à celles de l'utilisateur
      setFormData({ username: userData?.username || '', email: userData?.email || '', profilePicture: null });
    } else {
      // Remplir le formulaire avec les données de l'utilisateur
      setFormData({ username: userData?.username || '', email: userData?.email || '', profilePicture: null });
    }
  };

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleProjectFormToggle = () => {
    setIsProjectFormOpen(!isProjectFormOpen);
  };

  const handleRequestsToggle = () => {
    setIsRequestsOpen(!isRequestsOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });
    setProfilePicturePreview(URL.createObjectURL(file));
  };

  const handleTakePhoto = () => {
    // Logique pour ouvrir la caméra et capturer une photo
  };

  const handleDeletePhoto = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
      setProfilePicturePreview('');
      setFormData({ ...formData, profilePicture: null });
    }
  };

  const handlePhotoModalToggle = () => {
    setIsPhotoModalOpen(!isPhotoModalOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logique pour envoyer les données mises à jour, y compris la photo
    // Après soumission, fermeture de la modale
    setIsPhotoModalOpen(false);
  };

  useEffect(() => {
    // Fonction pour récupérer les données utilisateur
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Aucun token trouvé. Veuillez vous connecter.');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/users', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données utilisateur.');
        }

        const fetchedData = await response.json();
        setUserData(fetchedData);
        setFormData({ username: fetchedData.username, email: fetchedData.email, profilePicture: null });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="bg-white text-black w-64 p-6 shadow-lg rounded-lg relative">
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <img
              src={profilePicturePreview || userData?.profilePicture || '/default-profile.png'}
              alt="Profile"
              className="rounded-full w-28 h-28 mb-4 border-2 border-blue-500 object-cover"
            />
            <label
              onClick={handlePhotoModalToggle}
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-600"
              title="Changer la photo"
            >
              <FaPlus size={18} />
            </label>
          </div>

          <h2 className="text-xl font-semibold">{userData?.username}</h2>
          <h3 className="text-lg">{userData?.email}</h3>

          <button className="text-blue-600 hover:underline mt-4" onClick={handleProfileToggle}>
            Profil
          </button>
          <button className="text-blue-600 hover:underline mt-2" onClick={handleProjectFormToggle}>
            Soumettre un projet
          </button>
          <button className="text-blue-600 hover:underline mt-2" onClick={handleRequestsToggle}>
            Mes demandes
          </button>
          <button onClick={handlePasswordResetToggle} className="text-blue-600 hover:underline mt-2">
            Réinitialiser mot de passe
          </button>
          <button className="text-red-600 hover:underline mt-2" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4 text-black text-center">Bienvenue sur votre dashboard</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Modale pour le changement de photo */}
        {isPhotoModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg relative w-80 shadow-lg">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={handlePhotoModalToggle}
              >
                <FaTimes />
              </button>
              <h2 className="text-xl font-semibold text-center mb-4">Changer la photo de profil</h2>

              <div className="flex flex-col items-center space-y-4">
                <label className="cursor-pointer flex items-center space-x-2 text-blue-600">
                  <FaImage />
                  <span>Choisir une photo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
                <button onClick={handleDeletePhoto} className="flex items-center space-x-2 text-red-600">
                  <FaTrashAlt />
                  <span>Supprimer la photo</span>
                </button>
                <button onClick={handleTakePhoto} className="flex items-center space-x-2 text-green-600">
                  <FaCamera />
                  <span>Prendre une photo</span>
                </button>

                {profilePicturePreview && (
                  <div className="mt-4">
                    <h3 className="text-gray-700">Aperçu :</h3>
                    <img
                      src={profilePicturePreview}
                      alt="Aperçu de la nouvelle photo"
                      className="rounded-full w-28 h-28 object-cover"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white py-2 mt-4 w-full rounded-md hover:bg-blue-600"
              >
                Enregistrer
              </button>
            </div>
          </div>
        )}

        {/* Affichage du profil */}
        {isProfileOpen && (
          <div className="bg-white p-6 shadow-lg rounded-lg mt-4">
            <div className="flex items-center mb-4">
              <img
                src={profilePicturePreview || userData?.profilePicture || '/default-profile.png'}
                alt="Profile"
                className="rounded-full w-16 h-16 mr-4 border-2 border-blue-500 object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold">{userData?.username}</h2>
                <h3 className="text-lg">{userData?.email}</h3>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="mt-4">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="border border-gray-300 p-2 rounded-md w-full mb-4"
                  placeholder="Nom d'utilisateur"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border border-gray-300 p-2 rounded-md w-full mb-4"
                  placeholder="Email"
                />
                <div className="flex justify-between">
                  <button type="button" className="text-gray-600" onClick={handleEditToggle}>
                    Annuler
                  </button>
                  <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
                    Enregistrer
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={handleEditToggle}
                className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
              >
                Modifier
              </button>
            )}
          </div>
        )}

        {/* Formulaire de demande de projet */}
        {isProjectFormOpen && <ProjectRequestForm />}

        {/* Mes demandes */}
        {isRequestsOpen && <MesDemandes />}

        {/* Réinitialiser mot de passe */}
        {isPasswordResetOpen && <ForgotPassword />}
      </div>
    </div>
  );
};

export default UserDashboard;
