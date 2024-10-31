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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[90%] mx-auto">
      {projects.map((project) => (
        <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 max-w-sm">
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
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>
          )}
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h2>
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">{project.description}</p>
            
            <div className="space-y-1">
              <div className="flex items-center text-sm text-gray-700">
                <span className="font-semibold mr-2">Technologies:</span>
                <span className="truncate">{Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <span className="font-semibold mr-2">Date:</span>
                <span>{project.date}</span>
              </div>
            </div>

            {isAdmin && (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => onEdit(project)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProject(project.id!)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm"
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