import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // New state to manage message type (success/error)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Une erreur est survenue');
      }

      setMessage('Un lien de réinitialisation a été envoyé à votre adresse email.');
      setMessageType('success'); // Set success message type
    } catch (error) {
      setMessage('Erreur lors de l\'envoi du lien de réinitialisation.');
      setMessageType('error'); // Set error message type
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white-100">
      <div className="bg-white p-16 rounded-lg shadow-lg w-full max-w-xxl">
        <h2 className="text-2xl font-bold mb-4">Mot de passe oublié</h2>

        {message && (
          <p className={`${messageType === 'success' ? 'text-green-500' : 'text-red-500'} mb-4`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Adresse Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isSubmitting ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {isSubmitting ? 'Envoi...' : 'Envoyer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
