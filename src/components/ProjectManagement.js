import React, { useState, useEffect } from 'react';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', website: '' });
  const [imageFile, setImageFile] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [error, setError] = useState(null); // For handling errors

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/projects', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('title', newProject.title);
    formData.append('description', newProject.description);
    formData.append('website', newProject.website);
    if (imageFile) formData.append('image', imageFile);

    try {
      const response = await fetch('http://localhost:5000/projects', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      const data = await response.json();
      setProjects((prev) => [...prev, data]);
      setNewProject({ title: '', description: '', website: '' });
      setImageFile(null);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteProject = async (projectId) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/projects/${projectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((prev) => prev.filter((project) => project._id !== projectId));
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('title', editProject.title);
    formData.append('description', editProject.description);
    formData.append('website', editProject.website);
    if (imageFile) formData.append('image', imageFile);

    try {
      const response = await fetch(`http://localhost:5000/projects/${editProject._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const updatedProject = await response.json();
      setProjects((prev) =>
        prev.map((project) => (project._id === updatedProject._id ? updatedProject : project))
      );
      setEditProject(null);
      setImageFile(null);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditProject((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewProject((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleEditClick = (project) => {
    setEditProject(project);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl mb-4 text-center font-bold">Gestion des Projets</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>} {/* Display error message */}

      {/* Create Project */}
      <form onSubmit={handleCreateProject} className="mb-4 w-full min-h-[400px]">
        <h3 className="text-xl mb-2">Créer un nouveau projet</h3>
        <input
          type="text"
          name="title"
          placeholder="Titre du projet"
          value={newProject.title}
          onChange={handleInputChange}
          className="p-2 border rounded-md mb-2 w-full"
          required
        />
        <textarea
          name="description"
          placeholder="Description du projet"
          value={newProject.description}
          onChange={handleInputChange}
          className="p-2 border rounded-md mb-2 w-full"
          required
        />
        <input
          type="text"
          name="website"
          placeholder="Lien du site web"
          value={newProject.website}
          onChange={handleInputChange}
          className="p-2 border rounded-md mb-2 w-full"
        />
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          className="p-2 border rounded-md mb-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md w-full">
          Créer le projet
        </button>
      </form>

      {/* Update Project */}
      {editProject && (
        <form onSubmit={handleUpdateProject} className="mb-4 w-full min-h-[400px]">
          <h3 className="text-xl mb-2">Modifier le projet</h3>
          <input
            type="text"
            name="title"
            placeholder="Titre du projet"
            value={editProject.title}
            onChange={(e) => handleInputChange(e, true)}
            className="p-2 border rounded-md mb-2 w-full"
            required
          />
          <textarea
            name="description"
            placeholder="Description du projet"
            value={editProject.description}
            onChange={(e) => handleInputChange(e, true)}
            className="p-2 border rounded-md mb-2 w-full"
            required
          />
          <input
            type="text"
            name="website"
            placeholder="Lien du site web"
            value={editProject.website}
            onChange={(e) => handleInputChange(e, true)}
            className="p-2 border rounded-md mb-2 w-full"
          />
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="p-2 border rounded-md mb-2 w-full"
          />
          <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md w-full">
            Mettre à jour le projet
          </button>
          <button
            type="button"
            onClick={() => setEditProject(null)}
            className="bg-gray-600 text-white py-2 px-4 rounded-md w-full mt-2"
          >
            Annuler
          </button>
        </form>
      )}

      {/* List of Projects */}
      <ul>
        {projects.map((project) => (
          <li key={project._id} className="mb-2 p-4 border rounded-lg shadow-sm w-full">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold">{project.title}</h4>
                <p>{project.description}</p>
                {project.image && (
                  <img src={project.image} alt={project.title} className="w-20 h-20 object-cover mt-2" />
                )}
                {project.website && (
                  <a href={project.website} className="text-blue-600 hover:underline mt-2 block">
                    {project.website}
                  </a>
                )}
              </div>
              <div>
                <button
                  className="text-blue-600 hover:underline mr-2"
                  onClick={() => handleEditClick(project)}
                >
                  Modifier
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDeleteProject(project._id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectManagement;
