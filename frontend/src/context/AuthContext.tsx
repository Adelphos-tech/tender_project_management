'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { User, Permission } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  permissions: Permission[];
  userLevel: number;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  hasPermission: (module: string, action: 'view' | 'create' | 'edit' | 'delete' | 'export' | 'approve' | 'assign') => boolean;
  canAccessModule: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  permissions: [],
  userLevel: 0,
  login: async () => {},
  logout: () => {},
  loading: false,
  hasPermission: () => true,
  canAccessModule: () => true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userLevel, setUserLevel] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user permissions from backend
  const fetchPermissions = async (authToken: string) => {
    try {
      const response = await api.get('/roles/my-permissions', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (response.data) {
        setPermissions(response.data.permissions || []);
        setUserLevel(response.data.level || 1);
      }
    } catch (err) {
      console.error('Failed to fetch permissions:', err);
      // Set default permissions based on role
      setPermissions(getDefaultPermissions(user?.role || 'staff'));
    }
  };

  const getDefaultPermissions = (role: string): Permission[] => {
    const defaults: Record<string, Permission[]> = {
      admin: [
        { module: 'dashboard', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'vehicles', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'drivers', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'trips', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'inquiries', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'expenses', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'reports', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'documents', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'projectMaster', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'fundFlow', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'consultancyBill', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'contractorBill', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'tender', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'wip', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'property', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'inout', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'paymentSchedules', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'vehicleLogbook', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'hrm', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'hrmEmployees', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'hrmPayroll', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'hrmLeave', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'hrmAttendance', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'hrmRecruitment', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'userManagement', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'roleManagement', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'settings', canView: true, canCreate: true, canEdit: true, canDelete: true },
      ],
      manager: [
        { module: 'dashboard', canView: true, canCreate: false, canEdit: false, canDelete: false },
        { module: 'vehicles', canView: true, canCreate: true, canEdit: true, canDelete: false },
        { module: 'drivers', canView: true, canCreate: true, canEdit: true, canDelete: false },
        { module: 'trips', canView: true, canCreate: true, canEdit: true, canDelete: false },
        { module: 'inquiries', canView: true, canCreate: true, canEdit: true, canDelete: false },
        { module: 'expenses', canView: true, canCreate: true, canEdit: true, canDelete: false },
        { module: 'reports', canView: true, canCreate: false, canEdit: false, canDelete: false },
        { module: 'documents', canView: true, canCreate: true, canEdit: false, canDelete: false },
        { module: 'projectMaster', canView: true, canCreate: true, canEdit: true, canDelete: false },
        { module: 'fundFlow', canView: true, canCreate: true, canEdit: true, canDelete: false },
        { module: 'consultancyBill', canView: true, canCreate: true, canEdit: true, canDelete: false },
        { module: 'contractorBill', canView: true, canCreate: true, canEdit: true, canDelete: false },
        { module: 'tender', canView: true, canCreate: true, canEdit: true, canDelete: false },
        { module: 'wip', canView: true, canCreate: true, canEdit: true, canDelete: false },
        { module: 'property', canView: true, canCreate: true, canEdit: true, canDelete: false },
        { module: 'inout', canView: true, canCreate: true, canEdit: true, canDelete: false },
        { module: 'paymentSchedules', canView: true, canCreate: true, canEdit: false, canDelete: false },
        { module: 'vehicleLogbook', canView: true, canCreate: true, canEdit: true, canDelete: false },
        { module: 'hrm', canView: true, canCreate: false, canEdit: false, canDelete: false },
        { module: 'hrmEmployees', canView: true, canCreate: true, canEdit: true, canDelete: false },
        { module: 'hrmPayroll', canView: true, canCreate: false, canEdit: false, canDelete: false },
        { module: 'hrmLeave', canView: true, canCreate: true, canEdit: false, canDelete: false },
        { module: 'hrmAttendance', canView: true, canCreate: false, canEdit: false, canDelete: false },
        { module: 'hrmRecruitment', canView: true, canCreate: false, canEdit: false, canDelete: false },
      ],
      staff: [
        { module: 'inquiries', canView: true, canCreate: true, canEdit: false, canDelete: false },
        { module: 'trips', canView: true, canCreate: false, canEdit: false, canDelete: false },
        { module: 'expenses', canView: true, canCreate: true, canEdit: false, canDelete: false },
      ],
      driver: [
        { module: 'trips', canView: true, canCreate: false, canEdit: true, canDelete: false },
        { module: 'expenses', canView: true, canCreate: true, canEdit: false, canDelete: false },
      ],
    };
    return defaults[role] || [];
  };

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser && storedUser !== 'undefined') {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        fetchPermissions(storedToken);
      } else {
        // Wireframe mode: set default mock user
        const mockUser = {
          _id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin' as const,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        setUser(mockUser);
        setPermissions(getDefaultPermissions('admin'));
      }
    } catch (err) {
      console.error('Failed to parse user from local storage:', err);
      // Wireframe mode: set default mock user on error too
      const mockUser = {
        _id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin' as const,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
      setPermissions(getDefaultPermissions('admin'));
    } finally {
      setLoading(false);
    }
  }, []);

  const hasPermission = (module: string, action: 'view' | 'create' | 'edit' | 'delete' | 'export' | 'approve' | 'assign'): boolean => {
    const permission = permissions.find(p => p.module === module);
    if (!permission) return false;

    switch (action) {
      case 'view': return permission.canView;
      case 'create': return permission.canCreate;
      case 'edit': return permission.canEdit;
      case 'delete': return permission.canDelete;
      case 'export': return permission.canExport || false;
      case 'approve': return permission.canApprove || false;
      case 'assign': return permission.canAssign || false;
      default: return false;
    }
  };

  const canAccessModule = (module: string): boolean => {
    const permission = permissions.find(p => p.module === module);
    return permission?.canView || false;
  };

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setToken(data.token);
    setUser(data);

    // Fetch permissions after login
    await fetchPermissions(data.token);

    // Redirect based on role
    if (data.role === 'staff') {
      router.push('/trip-inquiries');
    } else if (data.role === 'driver') {
      router.push('/trips');
    } else {
      router.push('/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setPermissions([]);
    setUserLevel(0);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, permissions, userLevel, login, logout, loading, hasPermission, canAccessModule }}>
      {children}
    </AuthContext.Provider>
  );
}
