import React, { useEffect, useState } from 'react';

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/visitor-count');
        const data = await response.json();
        setVisitorCount(data.visitorCount);
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre de visiteurs:', error);
      }
    };

    fetchVisitorCount();
  }, []);

  return (
    <div>
      <h3>Nombre de visiteurs : {visitorCount}</h3>
    </div>
  );
};

export default VisitorCounter;
