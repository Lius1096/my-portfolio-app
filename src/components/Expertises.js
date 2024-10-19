import React, { useEffect, useState } from 'react';

const Expertise = () => {
  const [expertises, setExpertises] = useState([]);

  useEffect(() => {
    const fetchExpertises = async () => {
      try {
        const response = await fetch('http://localhost:5000/expertises');
        const data = await response.json();
        setExpertises(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des expertises:', error);
      }
    };

    fetchExpertises();
  }, []);

  return (
    <section id="expertises" className="bg-gray-100 text-gray-900 py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Savoirs-faire</h2>
        <p className="mb-8">Voici les compétences clés que je possède en tant que développeur full-stack :</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {expertises.map((expertise, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{expertise.title}</h3>
              <p>{expertise.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertise;
