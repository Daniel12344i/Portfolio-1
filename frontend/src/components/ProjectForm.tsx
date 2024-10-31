import React, { useState } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';
import { Project } from '../types/project';

interface ProjectFormProps {
  initialData: Project | null;
  onSubmit: (project: Project) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    technologies: initialData?.technologies || [],
    date: initialData?.date || '',
    status: initialData?.status || 'draft',
    isPublic: initialData?.isPublic || false,
    collaborators: initialData?.collaborators || '',
    customer: initialData?.customer || '',
    githubUrl: initialData?.githubUrl || '',
    liveUrl: initialData?.liveUrl || ''
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const form = new FormData();
      
      const processedData = {
        ...formData,
        technologies: Array.isArray(formData.technologies) 
          ? formData.technologies 
          : formData.technologies?.toString().split(',').map(t => t.trim()) || [],
        tags: Array.isArray(formData.tags) 
          ? formData.tags 
          : formData.tags?.toString().split(',').map(t => t.trim()) || [],
        githubUrl: formData.githubUrl || '',
        liveUrl: formData.liveUrl || ''
      };

      console.log('Submitting project data:', processedData);

      form.append('projectData', JSON.stringify(processedData));
      
      if (mediaFile) {
        form.append('media', mediaFile);
      }

      const endpoint = initialData?.id 
        ? `${API_BASE_URL}${API_ENDPOINTS.UPDATE_PROJECT(initialData.id)}`
        : `${API_BASE_URL}${API_ENDPOINTS.ADD_PROJECT}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        body: form,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save project');
      }

      if (result.success) {
        onSubmit(result.project);
      } else {
        throw new Error(result.error || 'Failed to save project');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error submitting form:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title || ''}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Technologies</label>
        <input
          type="text"
          name="technologies"
          value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : formData.technologies || ''}
          onChange={handleInputChange}
          placeholder="React, Node.js, etc."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={formData.status || 'draft'}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Media</label>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="mt-1 block w-full"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
            GitHub Repository URL
          </label>
          <input
            type="url"
            id="githubUrl"
            name="githubUrl"
            value={formData.githubUrl || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://github.com/username/repo"
          />
        </div>

        <div>
          <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Live Website URL
          </label>
          <input
            type="url"
            id="liveUrl"
            name="liveUrl"
            value={formData.liveUrl || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://your-project-url.com"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {initialData ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
