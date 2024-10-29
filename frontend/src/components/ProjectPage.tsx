import React from 'react';
import { useParams } from 'react-router-dom'; // Assuming you use react-router for navigation
import { useProjects } from '../hooks/useProjects';

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the project ID from the URL
  const { projects } = useProjects(); // Fetch all projects using custom hook
  const project = projects.find((project) => project.id === Number(id)); // Find the project by ID

  if (!project) return <div>Project not found</div>;

  return (
    <div>
      <h1>{project.title}</h1>
      <p><strong>Description:</strong> {project.description}</p>
      <p><strong>Technologies:</strong> {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}</p>
      <p><strong>Date:</strong> {project.date}</p>
      <p><strong>Status:</strong> {project.status}</p>
      <p><strong>Public:</strong> {project.isPublic ? 'Yes' : 'No'}</p>
      <p><strong>Collaborators:</strong> {project.collaborators || 'None'}</p>
      <p><strong>Media:</strong> {project.media || 'None'}</p>
      <p><strong>Customer:</strong> {project.customer || 'None'}</p>
    </div>
  );
};

export default ProjectPage;