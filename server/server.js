// Importerer nødvendige moduler
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "node:fs/promises";

// Oppretter en ny Hono-applikasjon
const app = new Hono();

app.use("/*", cors());
app.use("/static/*", serveStatic({ root: "./" }));

const projectsFilePath = "./src/projects.json";

// Funksjon for å laste prosjekter fra JSON-filen
async function loadProjects() {
  try {
    const data = await fs.readFile(projectsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    } else {
      throw error;
    }
  }
}

// Funksjon for å lagre prosjekter til JSON-filen
async function saveProjects(projects) {
  await fs.writeFile(
    projectsFilePath,
    JSON.stringify(projects, null, 2),
    "utf8"
  );
}

// Last inn prosjekter ved oppstart
let projects = await loadProjects();

app.get("/", (c) => {
  return c.json(projects);
});

app.post("/add", async (c) => {
  const newProject = await c.req.json();
  projects.push(newProject);
  await saveProjects(projects);
  return c.json(projects, { status: 201 });
});

// Oppdaterer prosjekter
app.post("/update", async (c) => {
  projects = await c.req.json();
  await saveProjects(projects);
  return c.json(projects, { status: 200 });
});

// Sletter prosjekter
app.post("/delete", async (c) => {
  projects = await c.req.json();
  await saveProjects(projects);
  return c.json(projects, { status: 200 });
});

const port = 3000;

console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
