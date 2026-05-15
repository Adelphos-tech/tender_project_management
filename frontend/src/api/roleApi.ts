import api from '@/lib/api';
import { Role, Module, Permission } from '@/types';

export const roleApi = {
  // Get all roles
  getRoles: async (): Promise<Role[]> => {
    const response = await api.get('/roles');
    return response.data;
  },

  // Get single role
  getRole: async (id: string): Promise<Role> => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },

  // Create new role
  createRole: async (data: Partial<Role>): Promise<Role> => {
    const response = await api.post('/roles', data);
    return response.data;
  },

  // Update role
  updateRole: async (id: string, data: Partial<Role>): Promise<Role> => {
    const response = await api.put(`/roles/${id}`, data);
    return response.data;
  },

  // Delete role
  deleteRole: async (id: string): Promise<void> => {
    await api.delete(`/roles/${id}`);
  },

  // Initialize system roles
  initializeRoles: async (): Promise<{ message: string; results: Array<{ name: string; status: string }> }> => {
    const response = await api.post('/roles/init');
    return response.data;
  },

  // Get my permissions
  getMyPermissions: async (): Promise<{ role: string; level?: number; permissions: Permission[] }> => {
    const response = await api.get('/roles/my-permissions');
    return response.data;
  },

  // Get available modules
  getModules: async (): Promise<Module[]> => {
    const response = await api.get('/roles/modules');
    return response.data;
  },
};

export default roleApi;
