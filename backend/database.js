import prisma from "./prismaClient.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const setupDatabase = async () => {
  // Hash the admin password and insert default admin user
  const hashedPassword = await bcrypt.hash(config.admin.password, 10);

  await prisma.user.upsert({
    where: { username: config.admin.username },
    update: {},
    create: {
      username: config.admin.username,
      password: hashedPassword,
    },
  });

  // Create uploads directory if it doesn't exist
  const uploadPath = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log("Uploads directory created at:", uploadPath);
  }

  console.log("Database setup complete");
};

// Run setup if this file is run directly
if (import.meta.url === new URL(import.meta.url).href) {
  setupDatabase().catch(console.error);
}
