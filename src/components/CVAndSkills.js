import React from 'react';

const CVAndSkills = () => {
    return (
        <section id="cv-skills" className="py-20 bg-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
                    {/* Section CV */}
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <h2 className="text-3xl font-bold mb-4 text-center md:text-left text-blue-900">
                            Téléchargez mon CV
                        </h2>
                        <p className="text-gray-700 mb-6 text-center md:text-left">
                            Vous pouvez télécharger mon CV en format PDF en cliquant sur le bouton ci-dessous.
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <a
                                href="/asset/Julius-DJOSSOU-CV.pdf" // Remplacez ce chemin par le chemin réel de votre CV
                                download
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
                            >
                                Télécharger CV
                            </a>
                        </div>
                    </div>

                    
                </div>
            </div>
        </section>
    );
};

export default CVAndSkills;
