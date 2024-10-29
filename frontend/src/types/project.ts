export type ProjectStatus = 'draft' | 'published';

export interface Project {
  id?: number;
  title: string;
  description: string;
  technologies: string[] | string; // Can be an array or JSON string
  date: string;
  publishedAt?: string;
  isPublic: boolean;
  status: ProjectStatus;
  tags: string[] | string; // Can be an array or JSON string
  collaborators?: string;
  media?: string;
  customer?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface ProjectResponse {
  success: boolean;
  project?: Project;
  error?: string;
}

export interface DeleteResponse {
  success: boolean;
  error?: string;
}
