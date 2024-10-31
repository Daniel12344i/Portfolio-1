export const API_BASE_URL = 'http://localhost:3000';
export const API_ENDPOINTS = {
  PROJECTS: '/api/projects',
  ADD_PROJECT: '/api/projects/add',
  UPDATE_PROJECT: (id: number) => `/api/projects/update/${id}`,
  DELETE_PROJECT: '/api/projects/delete',
  LOGIN: '/api/login',
};
