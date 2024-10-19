import React, { useState } from 'react';

const EditProfileModal = ({ isOpen, closeModal, user }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email, // Non-editable for security
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update logic (send data to server)
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Modifier le profil</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Nom</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
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
            <button type="submit" className="bg-primary text-white py-2 px-4 rounded">
              Enregistrer
            </button>
            <button
              onClick={closeModal}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              Annuler
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default EditProfileModal;
