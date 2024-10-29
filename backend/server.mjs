import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";
import bcrypt from "bcrypt";
import prisma from "./prismaClient.js";
import { config } from "./config.js";
import { projectSchema, loginSchema } from "./validation.mjs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import { setupDatabase } from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Hono();

// CORS configuration
app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Requested-With"],
  })
);

// Serve static files from the uploads directory
app.use(
  "/uploads/*",
  serveStatic({
    root: "./",
    rewriteRequestPath: (path) => path,
  })
);

// Initialize database
setupDatabase().catch(console.error);

// Add this simpler file handling function instead
const saveFile = async (file, filename) => {
  const uploadDir = path.join(process.cwd(), 'uploads');
  
  // Ensure uploads directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, filename);
  const fileBuffer = await file.arrayBuffer();
  
  await fs.promises.writeFile(filePath, Buffer.from(fileBuffer));
  
  // Return the path relative to the server root
  return `/uploads/${filename}`;
};

app.get("/api/projects", async (c) => {
  try {
    const projects = await prisma.project.findMany();
    
    // Parse JSON strings back to arrays
    const formattedProjects = projects.map(project => ({
      ...project,
      technologies: JSON.parse(project.technologies),
      tags: JSON.parse(project.tags)
    }));

    return c.json(formattedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return c.json({
      success: false,
      error: "Failed to fetch projects",
      details: error.message
    }, 500);
  }
});

app.get("/api/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    return c.json({
      ...project,
      technologies: JSON.parse(project.technologies),
      tags: JSON.parse(project.tags),
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return c.json({ error: "Failed to fetch project" }, 500);
  }
});

app.post("/api/projects/add", async (c) => {
  try {
    const formData = await c.req.formData();
    const projectData = JSON.parse(formData.get("projectData"));
    console.log('Received project data:', projectData);
    
    const mediaFile = formData.get("media");
    let mediaPath = "None";
    
    if (mediaFile && mediaFile instanceof File) {
      const uniqueFilename = `${Date.now()}-${mediaFile.name}`;
      mediaPath = await saveFile(mediaFile, uniqueFilename);
    }

    // Create the project data object matching the schema
    const createData = {
      title: projectData.title,
      description: projectData.description,
      technologies: JSON.stringify(projectData.technologies),
      date: projectData.date || new Date().toISOString().split('T')[0],
      isPublic: Boolean(projectData.isPublic),
      status: projectData.status || 'draft',
      tags: JSON.stringify(projectData.tags || []),
      collaborators: projectData.collaborators || '',
      customer: projectData.customer || '',
      media: mediaPath,
      githubUrl: projectData.githubUrl || '',
      liveUrl: projectData.liveUrl || ''
    };

    console.log('Creating project with data:', createData);

    const newProject = await prisma.project.create({
      data: createData
    });

    return c.json({
      success: true,
      project: {
        ...newProject,
        technologies: JSON.parse(newProject.technologies),
        tags: JSON.parse(newProject.tags)
      }
    });
  } catch (error) {
    console.error("Project creation error:", error);
    return c.json({
      success: false,
      error: "Failed to add project",
      details: error.message
    }, 500);
  }
});

app.post("/api/projects/update/:id", async (c) => {
  try {
    const projectId = parseInt(c.req.param("id"));
    const formData = await c.req.formData();
    console.log('Update - Received form data keys:', [...formData.keys()]);
    
    const projectData = JSON.parse(formData.get("projectData"));
    console.log('Update - Project data:', projectData);
    
    // Get existing project
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!existingProject) {
      return c.json({ 
        success: false, 
        error: "Project not found" 
      }, 404);
    }

    // Handle media file
    const mediaFile = formData.get("media");
    let mediaPath = existingProject.media;
    
    if (mediaFile && mediaFile instanceof File) {
      // Delete old media file if it exists
      if (existingProject.media && existingProject.media !== 'None') {
        try {
          const oldFilePath = path.join(process.cwd(), existingProject.media);
          await fs.promises.unlink(oldFilePath);
        } catch (err) {
          console.error('Error deleting old media file:', err);
        }
      }
      
      // Save new media file
      const uniqueFilename = `${Date.now()}-${mediaFile.name}`;
      mediaPath = await saveFile(mediaFile, uniqueFilename);
    }

    // Update project data
    const updateData = {
      title: projectData.title,
      description: projectData.description,
      technologies: JSON.stringify(projectData.technologies),
      date: projectData.date,
      isPublic: Boolean(projectData.isPublic),
      status: projectData.status,
      tags: JSON.stringify(projectData.tags || []),
      collaborators: projectData.collaborators || '',
      customer: projectData.customer || '',
      media: mediaPath,
      githubUrl: projectData.githubUrl || '',
      liveUrl: projectData.liveUrl || ''
    };

    console.log('Updating project with data:', updateData);

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updateData
    });

    return c.json({
      success: true,
      project: {
        ...updatedProject,
        technologies: JSON.parse(updatedProject.technologies),
        tags: JSON.parse(updatedProject.tags)
      }
    });
  } catch (error) {
    console.error("Project update error:", error);
    return c.json({
      success: false,
      error: "Failed to update project",
      details: error.message
    }, 500);
  }
});

app.post("/api/projects/delete", async (c) => {
  try {
    const { id } = await c.req.json();
    const projectId = parseInt(id);

    // Get project to delete its media file if exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return c.json({ success: false, error: "Project not found" }, 404);
    }

    // Delete media file if exists
    if (project.media && project.media !== "None") {
      try {
        await fs.promises.unlink(path.join(process.cwd(), project.media));
      } catch (err) {
        console.error("Error deleting media file:", err);
      }
    }

    // Delete project from database
    await prisma.project.delete({
      where: { id: projectId }
    });

    return c.json({ success: true });
  } catch (error) {
    console.error("Project deletion error:", error);
    return c.json({
      success: false,
      error: "Failed to delete project",
      details: error.message
    }, 500);
  }
});

app.post("/api/login", async (c) => {
  try {
    const body = await c.req.json();
    const { username, password } = body;
    loginSchema.parse({ username, password });

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ username: user.username }, config.jwt.secret, {
        expiresIn: "1h",
      });
      return c.json({ token });
    } else {
      return c.json({ error: "Invalid credentials" }, 401);
    }
  } catch (error) {
    console.error("Error during login:", error);
    return c.json({ error: "Login failed", details: error.message }, 500);
  }
});

// Start server
const port = 3000;
console.log(`Server is running on http://localhost:${port}`);
serve({
  fetch: app.fetch,
  port,
});
