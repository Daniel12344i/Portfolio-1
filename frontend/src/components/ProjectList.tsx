import React, { useState, useEffect } from 'react';
import "../style.css";

// Funksjonskomponent for prosjektlisten
const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);  // State for prosjektene
  const [title, setTitle] = useState('');  // State for tittel inputfeltet
  const [description, setDescription] = useState('');  // State for beskrivelse inputfeltet
  const [technologies, setTechnologies] = useState('');  // State for teknologier inputfeltet
  const [editIndex, setEditIndex] = useState<number | null>(null);  // Index for redigering

  // Hent prosjekter fra serveren når komponenten laster
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:3000/');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Feil ved henting av prosjekter:', error);
      }
    };
    fetchProjects();
  }, []);

  // Funksjon for å legge til eller oppdatere prosjekter
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const newProject = {
      id: editIndex !== null ? projects[editIndex].id : projects.length + 1,
      title,
      description,
      technologies: technologies.split(',').map(tech => tech.trim()),  // Konverterer teknologier til en liste
      date: new Date().toISOString().split('T')[0]  // Setter dagens dato
    };
  
    if (editIndex !== null) {
      // Oppdater eksisterende prosjekt
      const updatedProjects = [...projects];
      updatedProjects[editIndex] = newProject;
      setProjects(updatedProjects);
  
      // Send oppdatering til serveren
      try {
        const response = await fetch(`http://localhost:3000/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProjects),  // Sender hele prosjektlisten til serveren
        });
  
        if (response.ok) {
          console.log('Prosjekt oppdatert på serveren');
        } else {
          console.error('Feil ved oppdatering av prosjekt på serveren');
        }
      } catch (error) {
        console.error('Feil ved sending av oppdatering til serveren:', error);
      }
  
      // Nullstill redigeringsmodus
      setEditIndex(null);
    } else {
      // Legg til nytt prosjekt
      setProjects([...projects, newProject]);
  
      // Send nytt prosjekt til serveren
      try {
        const response = await fetch('http://localhost:3000/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProject),
        });
  
        if (response.ok) {
          console.log('Prosjekt lagret på serveren');
        } else {
          console.error('Feil ved lagring av prosjekt på serveren');
        }
      } catch (error) {
        console.error('Feil ved sending av data til serveren:', error);
      }
    }
  
    // Nullstill inputfeltene etter innsending
    setTitle('');
    setDescription('');
    setTechnologies('');
  };
  
  // Funksjon for å redigere prosjekter
  const handleEdit = (index: number) => {
    const project = projects[index];
    setTitle(project.title);
    setDescription(project.description);
    setTechnologies(project.technologies.join(', '));
    setEditIndex(index);
  };

  // Funksjon for å slette prosjekter
  const handleDelete = async (index: number) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);

    // Send data til serveren
    try {
      const response = await fetch('http://localhost:3000/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProjects),
      });

      if (response.ok) {
        console.log('Prosjekt slettet fra serveren');
      } else {
        console.error('Feil ved sletting av prosjekt fra serveren');
      }
    } catch (error) {
      console.error('Feil ved sending av sletting til serveren:', error);
    }
  };

  return (
    <div className="project-container">
      <section id="project-list-section">
        <h2>Prosjektliste</h2>
        <ul id="project-list">
          {projects.map((project, index) => (
            <li key={project.id} className="project-item">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p><strong>Technologier:</strong> {project.technologies.join(', ')}</p>
              <p><em>{project.date}</em></p>
              <button className='knapp' onClick={() => handleEdit(index)}>Rediger</button>
              <button className='knapp' onClick={() => handleDelete(index)}>Slett</button>
            </li>
          ))}
        </ul>
      </section>

      <section id="project-form-section">
        <h2>{editIndex !== null ? 'Rediger Prosjekt' : 'Nytt Prosjekt'}</h2>
        <form id="project-form" onSubmit={handleSubmit}>
          <label>Tittel:</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Beskrivelse:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

          <label>Teknologier (komma-separert):</label>
          <input value={technologies} onChange={(e) => setTechnologies(e.target.value)} required />

          <button type="submit">{editIndex !== null ? 'Oppdater' : 'Legg til'}</button>
        </form>
      </section>
    </div>
  );
};

export default ProjectList
