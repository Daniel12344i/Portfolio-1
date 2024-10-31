import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Example seed data for the Project model
  await prisma.project.create({
    data: {
      title: "Sample Project",
      description: "This is a sample project description",
      technologies: JSON.stringify(["React", "Node.js"]),
      date: "2024-10-31",
      isPublic: true,
      status: "draft",
      tags: JSON.stringify(["tag1", "tag2"]),
      collaborators: "Sample Collaborator",
      media: "None",
      customer: "Sample Customer",
    },
  });

  console.log("Seed data created successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
