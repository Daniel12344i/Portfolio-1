import React, { useState, useEffect } from 'react';
import { Project } from '../types/project';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';
import { FaGithub, FaLinkedin, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons';


interface SkillCardProps {
  title: string;
  skills: string[];
}

interface ContactLinkProps {
  href: string;
  icon: React.ComponentType<IconBaseProps>;
  text: string;
}

interface SocialLinkProps {
  href: string;
  icon: React.ComponentType<IconBaseProps>;
  hoverColor?: string;
}

const UserDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROJECTS}`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        const publishedProjects = data.filter((project: Project) => project.status === 'published');
        setProjects(publishedProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };

    fetchProjects();
  }, []);

  // Toggle function with scroll prevention
  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Helper Components with proper type annotations
  const SocialLink: React.FC<SocialLinkProps> = ({ href, icon: Icon, hoverColor }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`transform hover:scale-110 transition-all duration-300 text-[#8892b0] hover:text-[#64ffda] ${hoverColor}`}
    >
      <Icon size={28} />
    </a>
  );

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-gray-100">
      {/* Updated Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#1F1F1F] z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Name - hide when menu is open */}
            <span className={`text-xl font-bold text-[#64ffda] transition-opacity duration-300 ${
              isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}>
              Daniel Zemichael
            </span>
            
            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-[#64ffda] hover:text-[#ccd6f6] transition-colors z-50"
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute h-0.5 w-full bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 top-3' : 'rotate-0 top-1'
                }`}></span>
                <span className={`absolute h-0.5 w-full bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100 top-3'
                }`}></span>
                <span className={`absolute h-0.5 w-full bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 top-3' : 'rotate-0 top-5'
                }`}></span>
              </div>
            </button>

            {/* Desktop Menu with hover effects */}
            <div className="hidden md:flex space-x-8">
              {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative text-gray-300 hover:text-[#64ffda] transition-colors duration-300 group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#64ffda] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`fixed inset-0 bg-[#0a192f] md:hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen 
                ? 'opacity-100 visible translate-x-0'
                : 'opacity-0 invisible translate-x-full'
            }`}
            style={{ zIndex: 40 }}
          >
            <div className="flex flex-col items-center justify-center h-screen space-y-8 text-xl">
              {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => toggleMenu()}
                  className="text-gray-300 hover:text-[#64ffda] transition-colors duration-300 py-2"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content - hide when mobile menu is open */}
      <div className={`transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center bg-[#0B0B0B]">
          {/* Pattern only in hero section */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="constellation-pattern"></div>
          </div>
          
          {/* Adjusted gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/30 via-[#0B0B0B]/20 to-transparent"></div>
          
          {/* Hero content with better typography and spacing */}
          <div className="container mx-auto px-4 py-32 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-7xl font-bold mb-8 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#64ffda] via-[#6ee7b7] to-[#34d399] animate-gradient-x">
                  Daniel
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#818cf8] via-[#6366f1] to-[#4f46e5] animate-gradient-x">
                  Zemichael
                </span>
              </h1>
              <p className="text-2xl text-gray-400 font-light mb-12 tracking-wide">
                Full Stack Developer | IT Student
              </p>
              {/* Enhanced social links */}
              <div className="flex justify-center space-x-8">
                <SocialLink href="..." icon={FaGithub} hoverColor="hover:text-[#64ffda]" />
                <SocialLink href="..." icon={FaLinkedin} hoverColor="hover:text-[#818cf8]" />
                <SocialLink href="..." icon={FaEnvelope} hoverColor="hover:text-[#6ee7b7]" />
              </div>
            </div>
          </div>

          {/* Wave transition */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
            <svg 
              className="relative block w-full h-24" 
              data-name="Layer 1" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none"
            >
              <path 
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                className="fill-[#0a192f] opacity-20"
              ></path>
              <path 
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                className="fill-[#0a192f] opacity-40"
                transform="translate(50 20)"
              ></path>
              <path 
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                className="fill-[#0a192f]"
                transform="translate(-50 40)"
              ></path>
            </svg>
          </div>
        </section>

        {/* About Me Section */}
        <section id="about" className="relative bg-[#0A0A0B] min-h-screen flex items-center justify-center py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                About Me
              </h2>
              
              <div className="space-y-6 text-lg">
                <p className="text-gray-400 leading-relaxed hover:text-gray-300 transition-colors duration-300">
                  Hi, I'm <span className="text-[#64ffda]">Daniel Zemichael</span>, a passionate Full Stack Developer and IT Student. I specialize in building modern
                  web applications using technologies like <span className="text-[#818CF8]">React</span>, <span className="text-[#36E4DA]">Node.js</span>, and <span className="text-[#EC4899]">TypeScript</span>.
                </p>

                <p className="text-gray-400 leading-relaxed hover:text-gray-300 transition-colors duration-300">
                  With a strong foundation in both <span className="text-[#36E4DA]">frontend</span> and <span className="text-[#818CF8]">backend</span> development, I enjoy creating seamless user
                  experiences while ensuring robust and scalable backend solutions.
                </p>

                <p className="text-gray-400 leading-relaxed hover:text-gray-300 transition-colors duration-300">
                  Currently pursuing my IT degree, I'm constantly learning and staying up-to-date with the latest
                  technologies and best practices in <span className="text-[#64ffda]">software development</span>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Skills Section */}
        <section id="skills" className="py-32 bg-[#0A0A0B]">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-white">Technical Skills</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Frontend Card */}
              <div className="relative p-[1px] rounded-3xl bg-gradient-to-br from-[#00DC82] to-[#36E4DA]">
                <div className="bg-[#0A0A0B] p-8 rounded-[22px] h-full">
                  <h3 className="text-[#00DC82] text-xl font-semibold mb-6">Frontend</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-[#00DC82] rounded-full mr-3"></span>
                      React.js / Next.js
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-[#00DC82] rounded-full mr-3"></span>
                      TypeScript
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-[#00DC82] rounded-full mr-3"></span>
                      Tailwind CSS
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-[#00DC82] rounded-full mr-3"></span>
                      HTML5 / CSS3
                    </li>
                  </ul>
                </div>
              </div>

              {/* Backend Card */}
              <div className="relative p-[1px] rounded-3xl bg-gradient-to-br from-[#818CF8] to-[#6366F1]">
                <div className="bg-[#0A0A0B] p-8 rounded-[22px] h-full">
                  <h3 className="text-[#818CF8] text-xl font-semibold mb-6">Backend</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-[#818CF8] rounded-full mr-3"></span>
                      Node.js / Express
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-[#818CF8] rounded-full mr-3"></span>
                      Python / Django
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-[#818CF8] rounded-full mr-3"></span>
                      RESTful APIs
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-[#818CF8] rounded-full mr-3"></span>
                      MongoDB / PostgreSQL
                    </li>
                  </ul>
                </div>
              </div>

              {/* Tools & Others Card */}
              <div className="relative p-[1px] rounded-3xl bg-gradient-to-br from-[#EC4899] to-[#F472B6]">
                <div className="bg-[#0A0A0B] p-8 rounded-[22px] h-full">
                  <h3 className="text-[#EC4899] text-xl font-semibold mb-6">Tools & Others</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-[#EC4899] rounded-full mr-3"></span>
                      Git / GitHub
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-[#EC4899] rounded-full mr-3"></span>
                      Docker
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-[#EC4899] rounded-full mr-3"></span>
                      AWS / Azure
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-[#EC4899] rounded-full mr-3"></span>
                      Agile / Scrum
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-32 bg-[#0A0A0B]">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-white">Featured Projects</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {projects.map(project => (
                <div 
                  key={project.id} 
                  className="group bg-[#111111] rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]"
                >
                  {/* Project Image */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {project.media && (
                      <img
                        src={`${API_BASE_URL}${project.media}`}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {Array.isArray(project.technologies) && project.technologies.map((tech: string, index: number) => (
                        <span 
                          key={index}
                          className="px-2.5 py-0.5 text-xs bg-[#1A1A1A] text-[#64ffda] rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center space-x-4">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1.5 text-gray-400 hover:text-[#64ffda] transition-colors duration-300 text-sm"
                        >
                          <FaGithub className="text-lg" />
                          <span>Source Code</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1.5 text-gray-400 hover:text-[#64ffda] transition-colors duration-300 text-sm"
                        >
                          <FaExternalLinkAlt className="text-base" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Get In Touch Section */}
        <section id="contact" className="py-32 bg-[#0A0A0B]">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-white">Get In Touch</h2>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative p-1 rounded-3xl bg-gradient-to-br from-[#00DC82] via-[#36E4DA] to-[#818CF8]">
                <div className="bg-[#0A0A0B] p-8 rounded-[22px]">
                  <div className="space-y-6">
                    {[
                      {
                        href: "mailto:your.email@example.com",
                        icon: FaEnvelope,
                        text: "your.email@example.com",
                        gradient: "from-[#00DC82] to-[#36E4DA]"
                      },
                      {
                        href: "https://linkedin.com/in/yourusername",
                        icon: FaLinkedin,
                        text: "LinkedIn Profile",
                        gradient: "from-[#818CF8] to-[#6366F1]"
                      },
                      {
                        href: "https://github.com/yourusername",
                        icon: FaGithub,
                        text: "GitHub Profile",
                        gradient: "from-[#EC4899] to-[#F472B6]"
                      }
                    ].map((link, index) => (
                      <a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-4 text-gray-300 hover:text-white transition-colors duration-300 group"
                      >
                        <span className={`p-3 rounded-full bg-gradient-to-r ${link.gradient}`}>
                          <link.icon className="text-xl text-white" />
                        </span>
                        <span className={`bg-gradient-to-r ${link.gradient} bg-clip-text text-transparent group-hover:opacity-80`}>
                          {link.text}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default UserDashboard;
