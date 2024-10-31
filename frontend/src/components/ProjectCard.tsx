import React, { useState } from 'react';
import { API_BASE_URL } from '../config/config';
import { Project } from '../types/project';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

interface ProjectCardProps {
  project: Project;
  isAdmin: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (id: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isAdmin, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {project.media && project.media !== 'None' && !imageError && (
        <div className="relative h-48">
          <img 
            src={`${API_BASE_URL}${project.media}`}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{project.title}</h2>
        <p className="text-gray-600 mb-4">{project.description}</p>
        <div className="space-y-2">
          <p><strong>Technologies:</strong> {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}</p>
          {isAdmin && <p><strong>Status:</strong> {project.status}</p>}
          {project.collaborators && (
            <p><strong>Collaborators:</strong> {project.collaborators}</p>
          )}
          
          {/* Project Links */}
          <div className="flex space-x-4 mt-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaGithub className="mr-2" /> GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FaExternalLinkAlt className="mr-2" /> Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => onEdit?.(project)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(project.id!)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
