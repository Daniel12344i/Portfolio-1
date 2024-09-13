import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "node:fs/promises";

// Oppretter en ny Hono-applikasjon
const app = new Hono();

// Aktiverer CORS
app.use("/*", cors());

// Serverer statiske filer om nødvendig
app.use("/static/*", serveStatic({ root: "./" }));

// Definerer stien til projects.json-filen
const projectsFilePath = "./projects.json";

// Funksjon for å laste prosjekter fra JSON-filen
async function loadProjects() {
  try {
    const data = await fs.readFile(projectsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return []; // Hvis filen ikke eksisterer, returner tom liste
    } else {
      throw error;
    }
  }
}

// Funksjon for å lagre prosjekter til JSON-filen
async function saveProjects(projects) {
  await fs.writeFile(
    projectsFilePath,
    JSON.stringify(projects, null, 2), // Formaterer JSON-dataen med innrykk
    "utf8"
  );
}

// Last inn prosjekter ved oppstart
let projects = await loadProjects();

// Henter listen over prosjekter
app.get("/", (c) => {
  return c.json(projects);
});

// Legger til et nytt prosjekt
app.post("/add", async (c) => {
  const newProject = await c.req.json();
  projects.push(newProject); // Legger til nytt prosjekt
  await saveProjects(projects); // Lagrer oppdatert liste til fil
  return c.json(projects, { status: 201 });
});

// Oppdaterer hele prosjektlisten
app.post("/update", async (c) => {
  projects = await c.req.json(); // Henter oppdatert liste
  await saveProjects(projects); // Lagrer til fil
  return c.json(projects, { status: 200 });
});

// Sletter et prosjekt
app.post("/delete", async (c) => {
  projects = await c.req.json(); // Henter oppdatert liste
  await saveProjects(projects); // Lagrer til fil
  return c.json(projects, { status: 200 });
});

// Starter serveren
const port = 3000;
console.log(`Server is running on http://localhost:${port}`);
serve({
  fetch: app.fetch,
  port,
});
