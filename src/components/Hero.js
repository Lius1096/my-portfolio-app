import React from 'react';

const Hero = () => {
  return (
    
    <section id="hero" className="bg-primary text-white py-32">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">KETE Consulting</h2>
        <p className="text-xl mb-8">Développeur web passionné par la création d’expériences numériques modernes.</p>
        <a href="#portfolio" className="bg-accent text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-opacity-80 transition">
          Voir mon travail
        </a>
      </div>
    </section>
    
  );
}

export default Hero;