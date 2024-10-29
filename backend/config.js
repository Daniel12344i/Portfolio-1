import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Load environment variables
dotenv.config();

// Validate JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error("Missing required JWT_SECRET in environment variables");
  console.error("Please check your .env file");
  process.exit(1);
}

export const config = {
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  admin: {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "password",
  },
};

// Path configuration
export const paths = {
  uploads: path.join(path.dirname(fileURLToPath(import.meta.url)), "uploads"),
};
