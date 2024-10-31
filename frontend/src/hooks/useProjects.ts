import { useState, useEffect } from 'react';
import { Project } from '../types/project';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROJECTS}`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (formData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADD_PROJECT}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to add project');
      
      const result = await response.json();
      if (result.success) {
        setProjects(prev => [...prev, result.project]);
        return result.project;
      } else {
        throw new Error(result.error || 'Failed to add project');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add project');
      throw err;
    }
  };

  const updateProject = async (formData: FormData, projectId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPDATE_PROJECT(projectId)}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to update project');
      
      const result = await response.json();
      if (result.success) {
        setProjects(prev => 
          prev.map(project => project.id === projectId ? result.project : project)
        );
        return result.project;
      } else {
        throw new Error(result.error || 'Failed to update project');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
      throw err;
    }
  };

  const deleteProject = async (projectId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.DELETE_PROJECT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: projectId }),
      });

      if (!response.ok) throw new Error('Failed to delete project');
      
      const result = await response.json();
      if (result.success) {
        setProjects(prev => prev.filter(project => project.id !== projectId));
      } else {
        throw new Error(result.error || 'Failed to delete project');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    error,
    loading,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject
  };
};
