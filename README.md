# Portfolio-v2 Project

## Project Overview

This version builds upon the initial portfolio project by:

- Converting the frontend to React for a better development experience and dynamic updates.
- Setting up a Node.js backend using the Hono framework.
- Integrating backend API endpoints to fetch, add, update, and delete project data stored in a JSON file.
- Utilizing TypeScript for enhanced type safety on both frontend and backend.
- Configuring CORS to ensure communication between the frontend and backend.

## Features

### Frontend
- Built with **React**.
- Dynamically displays a list of projects.
- Provides forms to add and update projects.
- Offers an option to delete projects.

### Backend
- Built with **Hono** and **Node.js**.
- Provides the following API endpoints:
  - **GET**: Fetch all projects.
  - **POST (add)**: Add a new project.
  - **POST (update)**: Update an existing project.
  - **POST (delete)**: Remove a project.

### Data Persistence
- The project data is stored and loaded from a JSON file on the backend (`projects.json`).

## Screenshots

### The design of the application is based on the following layout:
![Screenshot of Portfolio](Screenshot-portfolio-2.png)

## How to Run the Project

### Prerequisites
- Node.js installed on your machine.
- A package manager like **npm** or **yarn**.

### Running the Frontend
1. Navigate to the `frontend` directory.
```bash
cd frontend
npm install
npm run dev

    Open your browser and navigate to the app running at http://localhost:5173.

Running the Backend

    Navigate to the backend directory.

bash

cd backend
npm install
npm start

    The server should now be running at http://localhost:3000.
