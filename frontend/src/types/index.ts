export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'driver';
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Permission {
  _id?: string;
  module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport?: boolean;
  canApprove?: boolean;
  canAssign?: boolean;
}

export interface Role {
  _id: string;
  name: string;
  description?: string;
  level: number;
  permissions: Permission[];
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  name: string;
  icon: string;
  description: string;
  isParent?: boolean;
  parent?: string;
}

export interface Vehicle {
  _id: string;
  vehicleNumber: string;
  model: string;
  type: string;
  year?: number;
  color?: string;
  fuelType?: string;
  documents: { name: string; url: string; expiryDate: string }[];
  insuranceEndDate?: string;
  pucEndDate?: string;
  status: 'active' | 'inactive' | 'maintenance';
  currentKM: number;
  createdAt: string;
}

export interface Driver {
  _id: string;
  user: User | string;
  name: string;
  phone: string;
  email?: string;
  licenseNumber: string;
  licenseExpiry: string;
  isActive: boolean;
  inactiveReason?: string;
  address?: string;
  status: 'available' | 'on-trip' | 'off-duty';
  profileImage?: string;
  createdAt: string;
}

export interface TripInquiry {
  _id: string;
  createdBy: User;
  pickupLocation: string;
  dropLocation: string;
  dateTime: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  reviewedBy?: User;
  reviewedAt?: string;
  createdAt: string;
}

export interface Trip {
  _id: string;
  inquiry: TripInquiry;
  vehicle: Vehicle;
  driver: Driver;
  status: 'assigned' | 'in-progress' | 'completed';
  startKM?: number;
  endKM?: number;
  startOdometerImage?: string;
  endOdometerImage?: string;
  totalDistance: number;
  totalExpense: number;
  costPerKM: number;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  expenses?: Expense[];
  createdAt: string;
}

export interface Expense {
  _id: string;
  trip: Trip | string;
  type: 'fuel' | 'toll' | 'parking' | 'food' | 'maintenance' | 'other';
  amount: number;
  description?: string;
  date: string;
  billImage?: string;
  addedBy: User;
  createdAt: string;
}

export interface DashboardStats {
  stats: {
    totalVehicles: number;
    activeVehicles: number;
    totalDrivers: number;
    availableDrivers: number;
    pendingInquiries: number;
    activeTrips: number;
    completedTrips: number;
    totalExpense: number;
  };
  tripsByMonth: { _id: { year: number; month: number }; count: number; distance: number }[];
  expenseByType: { _id: string; total: number; count: number }[];
  recentTrips: Trip[];
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

export interface UserPermissions {
  role: string;
  level?: number;
  permissions: Permission[];
}

export interface NavItem {
  key: string;
  href: string;
  icon: string;
  label: string;
  requiredPermission?: string;
  children?: NavItem[];
}
