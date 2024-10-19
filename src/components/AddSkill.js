import React, { useState } from 'react';

const AddSkill = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('');
    const [apiUrl, setApiUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const skill = { name, description, icon, apiUrl };

        try {
            const response = await fetch('http://localhost:5000/skills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(skill),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout de la compétence');
            }

            const data = await response.json();
            console.log('Compétence ajoutée:', data);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    return (
        <section id="add-skill" className="py-20 bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Ajouter une Compétence</h2>
                <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
                    <input
                        type="text"
                        placeholder="Nom de la compétence"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 mb-4 border border-gray-300 rounded"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 mb-4 border border-gray-300 rounded"
                        rows="3"
                        required
                    ></textarea>
                    <input
                        type="text"
                        placeholder="URL de l'icône"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        className="w-full p-3 mb-4 border border-gray-300 rounded"
                    />
                    <input
                        type="url"
                        placeholder="URL de l'API"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        className="w-full p-3 mb-4 border border-gray-300 rounded"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-600 transition"
                    >
                        Ajouter
                    </button>
                </form>
            </div>
        </section>
    );
};

export default AddSkill;
