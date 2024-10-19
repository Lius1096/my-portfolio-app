import React, { useState, useEffect } from 'react';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [name, setName] = useState('');
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('http://localhost:5000/reviews');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des avis');
                }
                const data = await response.json();
                setReviews(data);
            } catch (error) {
                console.error('Erreur:', error);
            }
        };

        fetchReviews();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const review = { name, rating, comment };

        try {
            const response = await fetch('http://localhost:5000/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(review),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi de l\'avis');
            }

            const data = await response.json();
            console.log(data.message); // Message de confirmation
            setName('');
            setRating(1);
            setComment('');
            setIsSubmitting(false);

            // Ré-fetch des avis
            const updatedResponse = await fetch('http://localhost:5000/reviews');
            const updatedData = await updatedResponse.json();
            setReviews(updatedData);
        } catch (error) {
            console.error('Erreur:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <section id="reviews" className="py-20 bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Avis des Clients</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-2">{review.name}</h3>
                            <div className="mb-4">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <span
                                        key={i}
                                        className={`text-2xl ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
                    <input
                        type="text"
                        placeholder="Votre nom"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 mb-4 border border-gray-300 rounded"
                    />
                    <div className="flex items-center mb-4">
                        {Array.from({ length: 5 }, (_, i) => (
                            <span
                                key={i}
                                onClick={() => setRating(i + 1)}
                                className={`text-2xl cursor-pointer ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <textarea
                        placeholder="Votre avis"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-3 mb-4 border border-gray-300 rounded"
                        rows="5"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-600 transition"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Reviews;
