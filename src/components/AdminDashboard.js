import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa'; // Pour l'icône de téléchargement
import AdminProfile from './AdminProfile';
import UserManagement from './UserManagement';
import ProjectManagement from './ProjectManagement.js';
import ForgotPassword from './ForgotPassword';
import BackToHomeButton from './BackToHomeButton';

const AdminDashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isProjectManagementOpen, setIsProjectManagementOpen] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null); // Gère l'URL de l'image
  const [profileError, setProfileError] = useState(false); // Gère les erreurs de chargement d'image

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
    window.location.href = '/login';
  };

  // Gestion du changement d'image de profil
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setProfilePicture(fileURL); // Met à jour l'image si elle est valide
      setProfileError(false); // Réinitialise l'erreur
    } else {
      setProfileError(true); // Affiche une erreur si le fichier n'est pas correct
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="bg-white text-black w-64 p-6 shadow-lg rounded-lg">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-xl font-semibold text-center">Admin Dashboard</h2>

          {/* Affichage de la photo de profil avec icône */}
          <div className="relative my-6">
            {profilePicture ? (
              <img
                src={profilePicture }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-2 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <span className="text-gray-400">Photo</span>
              </div>
            )}
            {/* Bouton pour télécharger une nouvelle image avec icône */}
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
          {/* Affiche un message d'erreur si le fichier n'est pas valide */}
          {profileError && (
            <p className="text-red-600 text-sm">Erreur: Veuillez sélectionner une image valide.</p>
          )}

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

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4 text-black text-center">Bienvenue sur l'Admin Dashboard</h1>

        {isProfileOpen && <AdminProfile />}
        {isUserManagementOpen && <UserManagement />}
        {isProjectManagementOpen && <ProjectManagement />}
        {isPasswordResetOpen && <ForgotPassword />}
      </div>
    </div>
  );
};

export default AdminDashboard;
