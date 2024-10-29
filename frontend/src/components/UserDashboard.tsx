import React, { useState, useEffect, FormEvent } from 'react';
import { Project } from '../types/project';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const UserDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROJECTS}`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        const publishedProjects = data.filter((project: Project) => project.status === 'published');
        setProjects(publishedProjects);
      } catch (err) {
        setError('Failed to fetch projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section with Glass Effect */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-32">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Daniel Afewerki</h1>
            <p className="text-xl mb-8 text-blue-100">Full Stack Developer | IT Student</p>
            <div className="flex justify-center space-x-6">
              <a href="https://github.com/yourusername" 
                 className="transform hover:scale-110 transition-transform duration-200 hover:text-blue-200">
                <FaGithub size={28} />
              </a>
              <a href="https://linkedin.com/in/yourusername" 
                 className="transform hover:scale-110 transition-transform duration-200 hover:text-blue-200">
                <FaLinkedin size={28} />
              </a>
              <a href="mailto:your.email@example.com" 
                 className="transform hover:scale-110 transition-transform duration-200 hover:text-blue-200">
                <FaEnvelope size={28} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section with Glass Card */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">About Me</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              I'm a passionate IT student focusing on full-stack development. With a strong foundation in both frontend and backend technologies, 
              I enjoy creating efficient and user-friendly applications that solve real-world problems.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Currently pursuing my degree in IT, I'm particularly interested in web development, cloud computing, and AI/ML technologies. 
              I'm always eager to learn new technologies and take on challenging projects.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section with Modern Cards */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
              <h3 className="font-bold mb-4 text-blue-600">Programming Languages</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  JavaScript/TypeScript
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Python
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  SQL
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
              <h3 className="font-bold mb-4 text-blue-600">Frontend</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  React
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Tailwind CSS
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  HTML5/CSS3
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
              <h3 className="font-bold mb-4 text-blue-600">Backend</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Node.js
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Express
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  SQLite
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
              <h3 className="font-bold mb-4 text-blue-600">Tools & Platforms</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Git
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Docker
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  VS Code
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section with Modern Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Featured Projects</h2>
          {loading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} 
                   className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                {project.media && project.media !== 'None' && (
                  <div className="relative h-48">
                    <img 
                      src={`${API_BASE_URL}${project.media}`}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      <strong>Technologies:</strong> {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
                    </p>
                    {project.collaborators && (
                      <p className="text-sm text-gray-600">
                        <strong>Collaborators:</strong> {project.collaborators}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-4 mt-6">
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
                        Live Demo →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Get In Touch</h2>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Contact Information</h3>
                <div className="space-y-4">
                  <a href="mailto:your.email@example.com" 
                     className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                    <FaEnvelope className="mr-3" />
                    your.email@example.com
                  </a>
                  <a href="https://linkedin.com/in/yourusername" 
                     className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                    <FaLinkedin className="mr-3" />
                    LinkedIn Profile
                  </a>
                  <a href="https://github.com/yourusername" 
                     className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                    <FaGithub className="mr-3" />
                    GitHub Profile
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Location</h3>
                <p className="text-gray-600">Oslo, Norway</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
