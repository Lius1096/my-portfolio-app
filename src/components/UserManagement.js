import React, { useState, useEffect } from 'react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [searchTerm, setSearchTerm] = useState(''); // État pour la recherche

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/users', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des utilisateurs');
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Mettre à jour la recherche en fonction de l'entrée de l'utilisateur
    };

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `http://localhost:5000/users/${currentUser._id}` : 'http://localhost:5000/users';

        try {
            const response = await fetch(url, {
                method,
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(isEditing ? 'Erreur lors de la mise à jour de l\'utilisateur' : 'Erreur lors de la création de l\'utilisateur');
            }

            setFormData({ username: '', email: '', password: '' });
            setIsEditing(false);
            fetchUsers(); // Rafraîchir la liste des utilisateurs après ajout/mise à jour
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de l\'utilisateur');
            }

            fetchUsers(); // Rafraîchir la liste des utilisateurs après suppression
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const handleEditUser = (user) => {
        setCurrentUser(user);
        setFormData({ username: user.username, email: user.email, password: '' });
        setIsEditing(true);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl mb-4">Gestion des Utilisateurs</h2>
            {error && <p className="text-red-600">{error}</p>}

            {/* Barre de recherche */}
            <div className="mb-4">
                <input 
                    type="text" 
                    placeholder="Rechercher par nom d'utilisateur ou email" 
                    value={searchTerm} 
                    onChange={handleSearchChange} 
                    className="border border-gray-300 rounded p-2 w-full"
                />
            </div>

            <form onSubmit={handleSubmit} className="mb-4 flex flex-col md:flex-row">
                <input
                    type="text"
                    name="username"
                    placeholder="Nom d'utilisateur"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded p-2 mr-2 mb-2 md:mb-0"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded p-2 mr-2 mb-2 md:mb-0"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2 mr-2 mb-2 md:mb-0"
                />
                <button type="submit" className={`bg-blue-500 text-white rounded p-2 ${isEditing ? 'hover:bg-blue-600' : 'hover:bg-green-600'}`}>
                    {isEditing ? 'Mettre à jour' : 'Ajouter un utilisateur'}
                </button>
            </form>

            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Nom d'utilisateur</th>
                        <th className="border border-gray-300 px-4 py-2">Email</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    className="text-blue-600 hover:underline mr-2"
                                    onClick={() => handleEditUser(user)}
                                >
                                    Éditer
                                </button>
                                <button
                                    className="text-red-600 hover:underline"
                                    onClick={() => handleDeleteUser(user._id)}
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
