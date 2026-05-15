import client from './client';

export const documentApi = {
  uploadDocument: async (data: FormData) => {
    const response = await client.post('/documents/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getDocuments: async (params?: any) => {
    const response = await client.get('/documents', { params });
    return response.data;
  },

  getDocumentStats: async () => {
    const response = await client.get('/documents/stats');
    return response.data;
  },

  getDocumentById: async (id: string) => {
    const response = await client.get(`/documents/${id}`);
    return response.data;
  },

  updateDocument: async (id: string, data: any) => {
    const response = await client.put(`/documents/${id}`, data);
    return response.data;
  },

  deleteDocument: async (id: string) => {
    const response = await client.delete(`/documents/${id}`);
    return response.data;
  },

  downloadDocument: async (id: string) => {
    const response = await client.post(`/documents/${id}/download`);
    return response.data;
  },
};
