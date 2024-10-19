import React, { useState, useEffect } from 'react';

const ProjectRequestForm = ({ selectedRequest }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    budget: 'À discuter',
    timeline: 'À discuter',
    contactMethod: 'email',
    additionalNotes: '',
    projectFile: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState('');
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (selectedRequest) {
      setFormData({
        projectName: selectedRequest.projectName || '',
        projectDescription: selectedRequest.projectDescription || '',
        budget: selectedRequest.budget || 'À discuter',
        timeline: selectedRequest.timeline || 'À discuter',
        contactMethod: selectedRequest.contactMethod || 'email',
        additionalNotes: selectedRequest.additionalNotes || '',
        projectFile: null,
      });

      if (selectedRequest.documents) {
        setDocuments(selectedRequest.documents);
      }
    }
  }, [selectedRequest]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      projectFile: e.target.files[0],
    });
  };

  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 2 * 1024 * 1024;

    if (file && (!allowedTypes.includes(file.type) || file.size > maxSize)) {
      return 'Le fichier doit être un PDF, JPG ou PNG et ne doit pas dépasser 2 Mo.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fileError = validateFile(formData.projectFile);
    if (fileError) {
      setFormErrors({ projectFile: fileError });
      return;
    }

    const url = selectedRequest
      ? `http://localhost:5000/project-requests/${selectedRequest._id}`
      : 'http://localhost:5000/project-requests';
    const method = selectedRequest ? 'PUT' : 'POST';

    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value);
    });

    try {
      const response = await fetch(url, {
        method: method,
        body: formDataToSubmit,
      });

      if (response.ok) {
        setMessage('Formulaire soumis avec succès.');
        setFormErrors({});
        setFormData({
          projectName: '',
          projectDescription: '',
          budget: 'À discuter',
          timeline: 'À discuter',
          contactMethod: 'email',
          additionalNotes: '',
          projectFile: null,
        });
        setDocuments([]);
      } else {
        setMessage('Erreur lors de la soumission du formulaire.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors de la soumission du formulaire.');
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      const response = await fetch(`http://localhost:5000/documents/${docId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDocuments(documents.filter((doc) => doc._id !== docId));
        setMessage('Document supprimé avec succès.');
      } else {
        setMessage('Erreur lors de la suppression du document.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors de la suppression du document.');
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Demande de projet</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label htmlFor="projectName" className="block text-sm font-medium mb-1">Nom du projet</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            placeholder="Nom du projet"
            className="border border-gray-300 p-2 w-full rounded-md"
            aria-label="Nom du projet"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="projectDescription" className="block text-sm font-medium mb-1">Description du projet</label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            placeholder="Description du projet"
            className="border border-gray-300 p-2 w-full rounded-md"
            aria-label="Description du projet"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="budget" className="block text-sm font-medium mb-1">Budget</label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded-md"
            aria-label="Budget"
          >
            <option value="À discuter">À discuter</option>
            <option value="500-1000">500€ - 1000€</option>
            <option value="1000-5000">1000€ - 5000€</option>
            <option value="5000+">5000€+</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="timeline" className="block text-sm font-medium mb-1">Délai</label>
          <select
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded-md"
            aria-label="Délai"
          >
            <option value="À discuter">À discuter</option>
            <option value="1-2 semaines">1-2 semaines</option>
            <option value="1 mois">1 mois</option>
            <option value="3 mois">3 mois</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="contactMethod" className="block text-sm font-medium mb-1">Méthode de contact</label>
          <select
            id="contactMethod"
            name="contactMethod"
            value={formData.contactMethod}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded-md"
            aria-label="Méthode de contact"
          >
            <option value="email">Email</option>
            <option value="phone">Téléphone</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="additionalNotes" className="block text-sm font-medium mb-1">Notes supplémentaires</label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            placeholder="Ajouter des notes supplémentaires"
            className="border border-gray-300 p-2 w-full rounded-md"
            aria-label="Notes supplémentaires"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="projectFile" className="block text-sm font-medium mb-1">Joindre un fichier</label>
          <input
            type="file"
            id="projectFile"
            name="projectFile"
            onChange={handleFileChange}
            className={`border p-2 w-full rounded-md ${formErrors.projectFile ? 'border-red-500' : 'border-gray-300'}`}
            aria-label="Joindre un fichier"
          />
          {formErrors.projectFile && (
            <p className="text-red-500 text-sm mt-1">{formErrors.projectFile}</p>
          )}
        </div>

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          {selectedRequest ? 'Modifier la demande' : 'Envoyer la demande'}
        </button>
      </form>

      {documents.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Documents joints</h3>
          <ul>
            {documents.map((doc) => (
              <li key={doc._id} className="mb-2">
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {doc.filename}
                </a>
                <button
                  className="ml-2 text-red-600"
                  onClick={() => handleDeleteDocument(doc._id)}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectRequestForm;
