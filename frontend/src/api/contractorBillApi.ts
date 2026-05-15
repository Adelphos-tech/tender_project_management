import client from './client';

export const contractorBillApi = {
  getStats: async () => {
    const response = await client.get('/contractor-bills/stats');
    return response.data.stats;
  },

  getAll: async (params?: any) => {
    const response = await client.get('/contractor-bills', { params });
    return response.data.bills;
  },

  getById: async (id: string) => {
    const response = await client.get(`/contractor-bills/${id}`);
    return response.data.bill;
  },

  create: async (data: any) => {
    const response = await client.post('/contractor-bills', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await client.put(`/contractor-bills/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await client.delete(`/contractor-bills/${id}`);
    return response.data;
  },

  recordPayment: async (id: string, amountToPay: number) => {
    const response = await client.post(`/contractor-bills/${id}/pay`, { amountToPay });
    return response.data;
  }
};
