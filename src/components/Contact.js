import React, { useState } from 'react';
import BackToHomeButton from './BackToHomeButton';

const Contact = () => {
  // États pour les champs du formulaire
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const contactInfo = {
      name,
      email,
      message,
    };

    try {
      const response = await fetch('http://localhost:5000/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactInfo),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      const data = await response.json();
      setSubmitMessage(data.message || 'Message envoyé avec succès !');
      
      // Réinitialiser les champs du formulaire après soumission
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      setSubmitMessage('Erreur: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-primary text-white py-20">
      <div className="container mx-auto text-center ">
        <h2 className="text-3xl font-bold mb-4">Contactez-moi</h2>
        <p className="mb-8">Envoyez-moi un message en remplissant ce formulaire.</p>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white text-gray-900 p-6 rounded-lg shadow-lg">
          <input
            type="text"
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded"
            required
          />
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded"
            required
          />
          <textarea
            placeholder="Votre message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded"
            rows="5"
            required
          ></textarea>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-accent text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-80 transition"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
          </button>
        </form>
        {submitMessage && <p className="mt-4 text-green-500">{submitMessage}</p>}
        <BackToHomeButton />
      </div>
    </section>
  );
};

export default Contact;
