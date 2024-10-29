import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string()).default([]),
  date: z.string().optional().default(""),
  isPublic: z.boolean().optional().default(false),
  status: z.string().optional().default("draft"),
  tags: z.array(z.string()).optional().default([]),
  collaborators: z.string().optional().default(""),
  customer: z.string().optional().default(""),
  media: z.string().optional()
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
