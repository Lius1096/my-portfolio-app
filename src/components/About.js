import React from 'react';

const About = () => {
  return (
    <section id="about" className="bg-white py-20">
      <div className="container mx-auto grid grid-cols-2 gap-8 items-center">
        {/* Partie gauche avec la muqueuse */}
        <div className="flex justify-center">
          <div className="w-64 h-64 bg-blue-500 animate-mucus"></div>
        </div>
        
        {/* Partie droite avec le titre et le texte */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">About Digital Consulting</h2>
          <p className="text-gray-700 text-lg mb-6">
            Je suis un développeur web spécialisé dans la création d’applications front-end modernes. 
            Mon objectif est de créer des expériences utilisateur fluides et engageantes.
          </p>
          
        </div>
      </div>
    </section>
  );
}

export default About;
