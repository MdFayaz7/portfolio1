import axios, { AxiosResponse } from 'axios';

// Ensure consistent API base and compute origin for assets (uploads)
// Fallback to deployed backend if env var is missing (helps on Vercel)
const RAW_API_URL = (import.meta.env.VITE_API_URL as string) || 'https://portfolio1-7tw1.onrender.com/api';
const API_BASE_URL = RAW_API_URL.replace(/\/$/, '');
const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

export const assetUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // Ensure uploads are correctly prefixed even if DB stored just the filename
  let fixedPath = path;
  const isBareFilename = !path.includes('/') && /\.(png|jpe?g|gif|webp|svg|pdf)$/i.test(path);
  if (isBareFilename) {
    fixedPath = `uploads/${path}`;
  }
  if (!fixedPath.startsWith('/')) {
    fixedPath = `/${fixedPath}`;
  }
  const normalizedPath = fixedPath;
  return `${API_ORIGIN}${normalizedPath}`;
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (credentials: { email: string; password: string }) =>
    api.post('/auth/register', credentials),
  verify: () => api.get('/auth/verify'),
  me: () => api.get('/auth/me'),
};

// Profile API
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  downloadResume: () => api.get('/profile/resume', { responseType: 'blob' }),
  updateProfile: (data: FormData) =>
    api.put('/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Education API
export const educationAPI = {
  getEducation: () => api.get('/education'),
  createEducation: (data: any) => api.post('/education', data),
  updateEducation: (id: string, data: any) => api.put(`/education/${id}`, data),
  deleteEducation: (id: string) => api.delete(`/education/${id}`),
};

// Skills API
export const skillsAPI = {
  getSkills: () => api.get('/skills'),
  createSkill: (data: any) => api.post('/skills', data),
  updateSkill: (id: string, data: any) => api.put(`/skills/${id}`, data),
  deleteSkill: (id: string) => api.delete(`/skills/${id}`),
};

// Projects API
export const projectsAPI = {
  getProjects: () => api.get('/projects'),
  getFeaturedProjects: () => api.get('/projects?featured=true'),
  getProject: (id: string) => api.get(`/projects/${id}`),
  createProject: (data: FormData) =>
    api.post('/projects', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateProject: (id: string, data: any) =>
    data instanceof FormData
      ? api.put(`/projects/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      : api.put(`/projects/${id}`, data),
  deleteProject: (id: string) => api.delete(`/projects/${id}`),
  toggleFeatured: (id: string) => api.patch(`/projects/${id}/featured`),
};

// Contact API
export const contactAPI = {
  sendMessage: (data: any) => api.post('/contact', data),
  getMessages: (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    return api.get(`/contact?${params}`);
  },
  getMessage: (id: string) => api.get(`/contact/${id}`),
  updateMessageStatus: (id: string, status: string) =>
    api.patch(`/contact/${id}/status`, { status }),
  deleteMessage: (id: string) => api.delete(`/contact/${id}`),
};

// Upload API
export const uploadAPI = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadFiles: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadProfilePicture: (file: File) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return api.post('/upload/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;
