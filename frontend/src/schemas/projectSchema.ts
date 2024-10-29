import { z } from "zod";

export const projectSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  date: z.string().optional(),
  isPublic: z.boolean(),
  status: z.enum(["draft", "published"]),
  tags: z.array(z.string()).optional(),
  collaborators: z.string().optional(),
  media: z.string().optional(),
  customer: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal(''))
});

export type Project = z.infer<typeof projectSchema>;