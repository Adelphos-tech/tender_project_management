import client from './client';

export const fundFlowApi = {
  getStats: async () => {
    const response = await client.get('/fund-flow/stats');
    return response.data.stats;
  },

  getProjects: async () => {
    const response = await client.get('/fund-flow/projects');
    return response.data.projects;
  },

  getProjectById: async (id: string) => {
    const response = await client.get(`/fund-flow/projects/${id}`);
    return response.data;
  },

  createProject: async (data: any) => {
    const response = await client.post('/fund-flow/projects', data);
    return response.data;
  },

  updateProject: async (id: string, data: any) => {
    const response = await client.put(`/fund-flow/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string) => {
    const response = await client.delete(`/fund-flow/projects/${id}`);
    return response.data;
  },

  updateInstallment: async (projectId: string, installmentId: string, data: any) => {
    const response = await client.put(`/fund-flow/projects/${projectId}/installments/${installmentId}`, data);
    return response.data;
  },

  payInstallment: async (projectId: string, installmentId: string, notes?: string) => {
    const response = await client.post(`/fund-flow/projects/${projectId}/installments/${installmentId}/pay`, { notes });
    return response.data;
  }
};
