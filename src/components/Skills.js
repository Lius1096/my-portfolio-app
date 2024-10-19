import React, { useEffect, useState } from 'react';

const Skills = () => {
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await fetch('http://localhost:5000/skills');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des compétences');
                }
                const data = await response.json();
                setSkills(data);
            } catch (error) {
                console.error('Erreur:', error);
            }
        };

        fetchSkills();
    }, []);

    return (
        <section id="skills" className="py-20 bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Technologies utilisées</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skills.map(skill => (
                        <div key={skill._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center mb-4">
                                <img src={skill.icon} alt={skill.name} className="w-12 h-12 mr-4" />
                                <h3 className="text-xl font-semibold">{skill.name}</h3>
                            </div>
                            <p className="text-gray-700 mb-4">{skill.description}</p>
                            {skill.apiUrl && (
                                <a href={skill.apiUrl} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                                    En savoir plus
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
