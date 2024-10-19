import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/admin/dashboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données'); // Gérer les erreurs de réponse
                }
                return response.json();
            })
            .then(data => setData(data))
            .catch(error => {
                console.error('Erreur lors de la récupération des données du tableau de bord:', error);
                setError(error.message); // Mettez l'erreur dans l'état pour l'afficher
            });
    }, []);

    if (error) {
        return <div className="text-red-500 text-lg font-bold mt-10 text-center">{error}</div>; // Afficher l'erreur si elle se produit
    }

    if (!data) {
        return <div className="text-center text-lg font-bold mt-10">Chargement...</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Tableau de bord Administrateur</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-2">Utilisateurs</h2>
                    <p className="text-gray-700">Total: {data.usersCount}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-2">Projets</h2>
                    <p className="text-gray-700">Total: {data.projectsCount}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-2">Messages de Contact</h2>
                    <p className="text-gray-700">Total: {data.contactsCount}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-2">Avis</h2>
                    <p className="text-gray-700">Total: {data.reviewsCount}</p>
                </div>
            </div>

            {/* Sections pour les données */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Utilisateurs</h2>
                <ul className="list-disc ml-6">
                    {data.data.users.map(user => (
                        <li key={user._id} className="text-gray-700 mb-2">
                            {user.username} - {user.role}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Projets</h2>
                <ul className="list-disc ml-6">
                    {data.data.projects.map(project => (
                        <li key={project._id} className="text-gray-700 mb-2">
                            {project.title}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Contacts</h2>
                <ul className="list-disc ml-6">
                    {data.data.contacts.map(contact => (
                        <li key={contact._id} className="text-gray-700 mb-2">
                            {contact.name} - {contact.email}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Avis</h2>
                <ul className="list-disc ml-6">
                    {data.data.reviews.map(review => (
                        <li key={review._id} className="text-gray-700 mb-2">
                            {review.name} - {review.rating} étoiles
                        </li>
                    ))}
                </ul>
            </div>

            {/* Bouton de déconnexion */}
            <button
                onClick={() => {
                    fetch('/logout', { method: 'POST' })
                        .then(() => {
                            localStorage.removeItem('token'); // Enlever le token du stockage local
                            window.location.href = '/login';  // Rediriger vers la page de login
                        })
                        .catch(error => console.error('Erreur lors de la déconnexion:', error));
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-6"
            >
                Déconnexion
            </button>
        </div>
    );
};

export default AdminDashboard;
