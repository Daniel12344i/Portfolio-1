import React, { useState, useEffect } from 'react';
import ProjectForm from './ProjectForm';
import ProjectList from './ProjectList';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';
import { Project } from '../types/project';

interface AdminDashboardProps {
  adminToken: string | null;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminToken, onLogout }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [adminToken]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROJECTS}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
      setError('Failed to fetch projects');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.DELETE_PROJECT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete project');
        }

        setProjects(projects.filter(project => project.id !== id));
      } catch (error) {
        console.error('Failed to delete project', error);
        setError('Failed to delete project');
      }
    }
  };

  const handleFormSubmit = async (updatedProject: Project) => {
    try {
      if (editingProject) {
        const updatedProjects = projects.map(p => 
          p.id === updatedProject.id ? updatedProject : p
        );
        setProjects(updatedProjects);
      } else {
        setProjects([...projects, updatedProject]);
      }
      
      setIsEditing(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Failed to save project', error);
      setError('Failed to save project');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isEditing ? (
        <ProjectForm
          initialData={editingProject}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsEditing(false);
            setEditingProject(null);
          }}
        />
      ) : (
        <div>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-8"
          >
            Add New Project
          </button>
          <ProjectList
            isAdmin={true}
            projects={projects}
            onEdit={handleEdit}
            deleteProject={handleDelete}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
