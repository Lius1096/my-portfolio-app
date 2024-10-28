import React from 'react';
import Hero from '../components/Hero';
import Portfolio from '../components/Portfolio';
import About from '../components/About';
import Contact from '../components/Contact';
import Avis from '../components/Avis';
import CVAndSkills from '../components/CVAndSkills';
import Footer from '../components/Footer';
import Skills from '../components/Skills';
import Expertises from '../components/Expertises';
import VisitorCounter from '../components/VisitorCounter';




const Home = () => {
  return (
    <>
   
      <Hero />
      <About />
      <Expertises />
      <Portfolio />
      <Skills />
      <CVAndSkills />
      <Avis />
      <VisitorCounter />
      <Contact />
      <Footer />
    </>
  );
}

export default Home;
