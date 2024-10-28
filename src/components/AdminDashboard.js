import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Pour la redirection
import { FaPlus } from 'react-icons/fa';
import AdminProfile from './AdminProfile';
import UserManagement from './UserManagement';
import ProjectManagement from './ProjectManagement';
import ForgotPassword from './ForgotPassword';
import BackToHomeButton from './BackToHomeButton';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isProjectManagementOpen, setIsProjectManagementOpen] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profileError, setProfileError] = useState(false);
  const [adminInfo, setAdminInfo] = useState({ username: '', email: '' }); // État pour les informations de l'admin

  // Vérifie l'authentification au montage du composant
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/home'); 
    } else {
      // Récupérer les informations de l'admin ici, par exemple depuis une API
      fetchAdminInfo(); // Fonction pour récupérer les informations de l'admin
    }
  }, [navigate]);

  const fetchAdminInfo = async () => {
    const response = await fetch('/admin-user-profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setAdminInfo({ username: data.username, email: data.email });
      setProfilePicture(data.profilePicture); // Mettre à jour la photo de profil à partir de l'API
    } else {
      console.error('Erreur lors de la récupération des informations de l\'admin.');
    }
  };

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleUserManagementToggle = () => {
    setIsUserManagementOpen(!isUserManagementOpen);
  };

  const handleProjectManagementToggle = () => {
    setIsProjectManagementOpen(!isProjectManagementOpen);
  };

  const handlePasswordResetToggle = () => {
    setIsPasswordResetOpen(!isPasswordResetOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirige vers la page de connexion après déconnexion
  };

  // Gestion du changement d'image de profil
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setProfilePicture(fileURL);
      setProfileError(false);
    } else {
      setProfileError(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="bg-white text-black w-64 p-6 shadow-lg rounded-lg">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-xl font-semibold text-center">Tableau de bord Admin</h2>

          <div className="relative my-6">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profil"
                className="w-24 h-24 rounded-full object-cover mb-2 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <span className="text-gray-400">Photo</span>
              </div>
            )}
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-600"
              title="Changer la photo"
            >
              <FaPlus />
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="hidden"
            />
          </div>
          {profileError && (
            <p className="text-red-600 text-sm">Erreur : Veuillez sélectionner une image valide.</p>
          )}

          <div className="mt-4 text-center">
            <p className="font-semibold">{adminInfo.username}</p>
            <p className="text-sm text-gray-600">{adminInfo.email}</p>
          </div>

          <button className="text-blue-600 hover:underline mt-4" onClick={handleProfileToggle}>
            Profil Admin
          </button>
          <button className="text-blue-600 hover:underline mt-4" onClick={handleUserManagementToggle}>
            Gestion des utilisateurs
          </button>
          <button className="text-blue-600 hover:underline mt-4" onClick={handleProjectManagementToggle}>
            Gestion des projets
          </button>
          <button className="text-blue-600 hover:underline mt-4" onClick={handlePasswordResetToggle}>
            Réinitialiser le mot de passe
          </button>
          <button className="text-red-600 hover:underline mt-4" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
        <BackToHomeButton />
      </div>

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4 text-black text-center">Bienvenue sur le Tableau de bord Admin</h1>

        {isProfileOpen && <AdminProfile profilePicture={profilePicture} setProfilePicture={setProfilePicture} />}
        {isUserManagementOpen && <UserManagement />}
        {isProjectManagementOpen && <ProjectManagement />}
        {isPasswordResetOpen && <ForgotPassword />}
      </div>
    </div>
  );
};

export default AdminDashboard;
