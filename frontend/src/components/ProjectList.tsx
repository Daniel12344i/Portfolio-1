import React from 'react';
import { API_BASE_URL } from '../config/config';
import { Project } from '../types/project';

interface ProjectListProps {
  isAdmin: boolean;
  projects: Project[];
  onEdit: (project: Project) => void;
  deleteProject: (id: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ isAdmin, projects, onEdit, deleteProject }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
          {project.media && project.media !== 'None' && (
            <div className="relative h-48">
              <img 
                src={`${API_BASE_URL}${project.media}`}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', project.media);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{project.title}</h2>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="space-y-2">
              <p><strong>Technologies:</strong> {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}</p>
              <p><strong>Status:</strong> {project.status}</p>
              <p><strong>Date:</strong> {project.date}</p>
            </div>
            {isAdmin && (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => onEdit(project)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProject(project.id!)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;