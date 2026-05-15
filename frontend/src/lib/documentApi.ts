import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents`,
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

export const documentApi = {
  uploadDocument: async (data: FormData) => {
    const response = await api.post('/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getDocuments: async (params?: any) => {
    const response = await api.get('/', { params });
    return response.data;
  },

  getDocumentStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  },

  getDocumentById: async (id: string) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  updateDocument: async (id: string, data: any) => {
    const response = await api.put(`/${id}`, data);
    return response.data;
  },

  deleteDocument: async (id: string) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  },

  downloadDocument: async (id: string) => {
    const response = await api.post(`/${id}/download`);
    return response.data;
  },
};
