import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/fund-flow`,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const fundFlowApi = {
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data.stats;
  },

  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data.projects;
  },

  getProjectById: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (data: any) => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  updateProject: async (id: string, data: any) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  updateInstallment: async (projectId: string, installmentId: string, data: any) => {
    const response = await api.put(`/projects/${projectId}/installments/${installmentId}`, data);
    return response.data;
  },

  payInstallment: async (projectId: string, installmentId: string, notes?: string) => {
    const response = await api.post(`/projects/${projectId}/installments/${installmentId}/pay`, { notes });
    return response.data;
  }
};
