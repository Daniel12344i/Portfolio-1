import './style.css';
import projects from './projects.json';

// Funksjon for å vise prosjekter
function displayProjects() {
    const projectList = document.getElementById('project-list');
    if (projectList) {
        projectList.innerHTML = ''; // Tøm listen før du legger til prosjektene

        projects.forEach((project, index) => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project';

            projectElement.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <p><strong>Technologier:</strong> ${project.technologies.join(', ')}</p>
                <p><em>${project.date}</em></p>
                <button class="edit-btn" data-index="${index}">Rediger</button>
                <button class="delete-btn" data-index="${index}">Slett</button>
            `;

            projectList.appendChild(projectElement);
        });

        // Legg til klikkhendelser for "Rediger" og "Slett" knappene
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = parseInt((event.target as HTMLButtonElement).dataset.index!);
                editProject(index);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = parseInt((event.target as HTMLButtonElement).dataset.index!);
                deleteProject(index);
            });
        });
    }
}

// Funksjon for å legge til et nytt prosjekt
async function addProject(event: Event) {
    event.preventDefault();
    const titleInput = document.getElementById('title') as HTMLInputElement;
    const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
    const technologiesInput = document.getElementById('technologies') as HTMLInputElement;

    if (titleInput && descriptionInput && technologiesInput) {
        const newProject = {
            id: projects.length + 1,
            title: titleInput.value,
            description: descriptionInput.value,
            technologies: technologiesInput.value.split(',').map(tech => tech.trim()),
            date: new Date().toISOString().split('T')[0]
        };

        projects.push(newProject);
        displayProjects();

        titleInput.value = '';
        descriptionInput.value = '';
        technologiesInput.value = '';

        try {
            const response = await fetch('http://localhost:3000/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
}

// Funksjon for å redigere et prosjekt
function editProject(index: number) {
    const project = projects[index];
    const titleInput = document.getElementById('title') as HTMLInputElement;
    const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
    const technologiesInput = document.getElementById('technologies') as HTMLInputElement;

    if (titleInput && descriptionInput && technologiesInput) {
        titleInput.value = project.title;
        descriptionInput.value = project.description;
        technologiesInput.value = project.technologies.join(', ');

        form.onsubmit = async (event) => {
            event.preventDefault();

            project.title = titleInput.value;
            project.description = descriptionInput.value;
            project.technologies = technologiesInput.value.split(',').map(tech => tech.trim());

            displayProjects();

            try {
                const response = await fetch('http://localhost:3000/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(projects),
                });

                if (response.ok) {
                    console.log('Prosjekt oppdatert på serveren');
                } else {
                    console.error('Feil ved oppdatering av prosjekt på serveren');
                }
            } catch (error) {
                console.error('Feil ved sending av oppdatering til serveren:', error);
            }

            form.onsubmit = addProject; // Tilbakestill skjemaets onsubmit tilbake til addProject
        };
    }
}

// Funksjon for å slette et prosjekt
async function deleteProject(index: number) {
    projects.splice(index, 1);
    displayProjects();

    try {
        const response = await fetch('http://localhost:3000/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projects),
        });

        if (response.ok) {
            console.log('Prosjekt slettet fra serveren');
        } else {
            console.error('Feil ved sletting av prosjekt fra serveren');
        }
    } catch (error) {
        console.error('Feil ved sending av sletting til serveren:', error);
    }
}

// Event listeners
const form = document.getElementById('project-form') as HTMLFormElement;
form?.addEventListener('submit', addProject);

// Init
displayProjects();
