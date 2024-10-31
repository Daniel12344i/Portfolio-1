import React, { useState, useEffect, useMemo } from 'react';
import ProjectForm from './ProjectForm';
import ProjectList from './ProjectList';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';
import { Project } from '../types/project';
import { AdminStats } from '../types/admin';

interface AdminDashboardProps {
  adminToken: string;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminToken, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    storageUsed: '0 GB',
    lastUpdate: new Date().toLocaleString(),
    activeUsers: 1,
    systemStatus: 'operational'
  });

  // Update stats when projects change
  useEffect(() => {
    setAdminStats(prev => ({
      ...prev,
      totalProjects: projects.length,
      publishedProjects: projects.filter(p => p.status === 'published').length,
      draftProjects: projects.filter(p => p.status === 'draft').length,
      lastUpdate: new Date().toLocaleString()
    }));
  }, [projects]);

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => {
        if (filterStatus === 'all') return true;
        return project.status === filterStatus;
      })
      .filter(project => {
        const searchLower = searchQuery.toLowerCase();
        return (
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          (typeof project.technologies === 'string' 
            ? project.technologies.toLowerCase().includes(searchLower)
            : project.technologies.some(tech => tech.toLowerCase().includes(searchLower)))
        );
      });
  }, [projects, searchQuery, filterStatus]);

  // Show error message if exists
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Add these handler functions
  const handleFormSubmit = async (projectData: Project) => {
    try {
      if (editingProject) {
        const updatedProjects = projects.map(p => 
          p.id === projectData.id ? projectData : p
        );
        setProjects(updatedProjects);
      } else {
        setProjects([...projects, { ...projectData, id: Date.now() }]);
      }
      setIsEditing(false);
      setEditingProject(null);
    } catch (err) {
      setError('Failed to save project');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsEditing(true);
  };

  const handleDelete = async (projectId: number) => {
    try {
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROJECTS}`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError('Failed to fetch projects');
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-slate-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">Admin Control Panel</h1>
              <div className="hidden md:flex space-x-4">
                <a 
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors duration-200"
                >
                  View Site
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                Welcome, Admin
              </span>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-lg">
          {error}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Search projects by name, description, or technology..."
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2 min-w-[200px]">
              <label htmlFor="status-filter" className="text-gray-700 font-medium">
                Status:
              </label>
              <select
                id="status-filter"
                className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Search Results Summary */}
          <div className="mt-4 text-sm text-gray-600">
            Found {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
            {filterStatus !== 'all' && ` with status "${filterStatus}"`}
          </div>
        </div>

        {/* Project List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isEditing ? (
            <div className="p-4">
              <ProjectForm
                initialData={editingProject}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setIsEditing(false);
                  setEditingProject(null);
                }}
              />
            </div>
          ) : (
            <div className="p-4">
              <ProjectList
                isAdmin={true}
                projects={filteredProjects}
                onEdit={handleEdit}
                deleteProject={handleDelete}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
