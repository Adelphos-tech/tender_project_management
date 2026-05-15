// Mock API for Wireframe Deployment
// Returns dummy data so the frontend works without a backend

export const mockAuth = {
  login: async (email: string, password: string) => {
    return {
      token: 'mock-jwt-token',
      _id: '1',
      name: 'Admin User',
      email: email,
      role: 'admin',
    };
  },

  register: async (data: any) => {
    return { message: 'User registered successfully' };
  },

  getProfile: async () => {
    return {
      _id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      phone: '+91 98765 43210',
    };
  },
};

export const mockVehicles = {
  getAll: async () => {
    return [
      { _id: '1', name: 'Toyota Innova', number: 'MH01 AB 1234', type: 'SUV', status: 'available', capacity: 7 },
      { _id: '2', name: 'Honda City', number: 'MH02 CD 5678', type: 'Sedan', status: 'on_trip', capacity: 5 },
      { _id: '3', name: 'Maruti Swift', number: 'MH03 EF 9012', type: 'Hatchback', status: 'maintenance', capacity: 5 },
    ];
  },

  getById: async (id: string) => {
    return {
      _id: id,
      name: 'Toyota Innova',
      number: 'MH01 AB 1234',
      type: 'SUV',
      status: 'available',
      capacity: 7,
      fuelType: 'Diesel',
      year: 2023,
    };
  },
};

export const mockDrivers = {
  getAll: async () => {
    return [
      { _id: '1', name: 'Ramesh Kumar', phone: '+91 98765 11111', license: 'MH0120230001234', status: 'available' },
      { _id: '2', name: 'Suresh Patil', phone: '+91 98765 22222', license: 'MH0120230005678', status: 'on_duty' },
      { _id: '3', name: 'Mahesh Singh', phone: '+91 98765 33333', license: 'MH0120230009012', status: 'off_duty' },
    ];
  },
};

export const mockTrips = {
  getAll: async () => {
    return [
      { _id: '1', customerName: 'ABC Corp', destination: 'Mumbai Airport', date: '2024-01-15', status: 'completed', amount: 2500 },
      { _id: '2', customerName: 'XYZ Ltd', destination: 'Pune Station', date: '2024-01-16', status: 'ongoing', amount: 1800 },
      { _id: '3', customerName: 'Tech Solutions', destination: 'Andheri West', date: '2024-01-17', status: 'scheduled', amount: 1200 },
    ];
  },

  getById: async (id: string) => {
    return {
      _id: id,
      customerName: 'ABC Corp',
      destination: 'Mumbai Airport',
      date: '2024-01-15',
      status: 'completed',
      amount: 2500,
      vehicle: { name: 'Toyota Innova', number: 'MH01 AB 1234' },
      driver: { name: 'Ramesh Kumar' },
    };
  },
};

export const mockInquiries = {
  getAll: async () => {
    return [
      { _id: '1', customerName: 'John Doe', phone: '+91 98765 44444', destination: 'Goa', date: '2024-01-20', status: 'pending' },
      { _id: '2', customerName: 'Jane Smith', phone: '+91 98765 55555', destination: 'Lonavala', date: '2024-01-21', status: 'confirmed' },
    ];
  },
};

export const mockDocuments = {
  getAll: async () => {
    return [
      { _id: '1', name: 'Vehicle Insurance.pdf', type: 'pdf', size: 2048576, uploadedAt: '2024-01-10' },
      { _id: '2', name: 'RC Book Scan.jpg', type: 'image', size: 1536000, uploadedAt: '2024-01-08' },
      { _id: '3', name: 'Service Report.pdf', type: 'report', size: 1024000, uploadedAt: '2024-01-05' },
    ];
  },

  getById: async (id: string) => {
    return {
      _id: id,
      name: 'Vehicle Insurance.pdf',
      type: 'pdf',
      size: 2048576,
      uploadedAt: '2024-01-10',
      uploadedBy: { name: 'Admin User' },
      fileUrl: '#',
    };
  },
};

export const mockFundFlow = {
  getAll: async () => {
    return [
      { _id: '1', projectName: 'Highway Construction', clientName: 'NHAI', totalAmount: 5000000, paidAmount: 2500000, progressPercentage: 50 },
      { _id: '2', projectName: 'Bridge Repair', clientName: 'PWD', totalAmount: 2000000, paidAmount: 1800000, progressPercentage: 90 },
    ];
  },

  getById: async (id: string) => {
    return {
      project: {
        _id: id,
        projectName: 'Highway Construction',
        clientName: 'NHAI',
        totalAmount: 5000000,
        paidAmount: 2500000,
        progressPercentage: 50,
        status: 'active',
        startDate: '2024-01-01',
        paymentMode: 'milestone',
      },
      installments: [
        { _id: 'i1', installmentNo: 1, amount: 1000000, dueDate: '2024-01-15', status: 'paid', paidDate: '2024-01-14' },
        { _id: 'i2', installmentNo: 2, amount: 1500000, dueDate: '2024-02-15', status: 'paid', paidDate: '2024-02-14' },
        { _id: 'i3', installmentNo: 3, amount: 2500000, dueDate: '2024-03-15', status: 'pending' },
      ],
    };
  },
};

export const mockContractorBills = {
  getAll: async () => {
    return [
      { _id: '1', projectName: 'Office Building', contractorName: 'BuildWell Pvt Ltd', totalContractValue: 10000000, status: 'approved' },
      { _id: '2', projectName: 'Warehouse', contractorName: 'StrongFoundations', totalContractValue: 5000000, status: 'pending' },
    ];
  },

  getById: async (id: string) => {
    return {
      _id: id,
      projectName: 'Office Building',
      contractorName: 'BuildWell Pvt Ltd',
      totalContractValue: 10000000,
      paperBillAmount: 4000000,
      paymentRequested: 3000000,
      amountPaid: 2500000,
      paymentStatus: 'partial',
      status: 'approved',
      paperBillNo: 'BILL-2024-001',
      paperBillDate: '2024-01-10',
      onSiteCompletionPct: 45,
      onSiteMeasuredBy: 'Site Engineer',
      onSiteMeasurementDate: '2024-01-08',
    };
  },
};

export const mockDashboard = {
  getStats: async () => {
    return {
      stats: {
        totalVehicles: 15,
        totalDrivers: 12,
        activeVehicles: 10,
        availableDrivers: 8,
        activeTrips: 8,
        completedTrips: 42,
        pendingInquiries: 5,
        totalExpense: 180000,
      },
      tripsByMonth: [
        { _id: { month: 1, year: 2024 }, count: 12, distance: 1200 },
        { _id: { month: 2, year: 2024 }, count: 15, distance: 1500 },
        { _id: { month: 3, year: 2024 }, count: 10, distance: 1000 },
        { _id: { month: 4, year: 2024 }, count: 18, distance: 1800 },
        { _id: { month: 5, year: 2024 }, count: 14, distance: 1400 },
      ],
      expenseByType: [
        { _id: 'fuel', total: 85000 },
        { _id: 'maintenance', total: 45000 },
        { _id: 'tolls', total: 25000 },
        { _id: 'other', total: 25000 },
      ],
      recentTrips: [
        {
          _id: '1',
          vehicle: { vehicleNumber: 'MH01 AB 1234' },
          driver: { name: 'Ramesh Kumar' },
          inquiry: { pickupLocation: 'Mumbai', dropLocation: 'Pune' },
          status: 'completed',
          totalDistance: 150,
          totalExpense: 2500,
        },
        {
          _id: '2',
          vehicle: { vehicleNumber: 'MH02 CD 5678' },
          driver: { name: 'Suresh Patil' },
          inquiry: { pickupLocation: 'Delhi', dropLocation: 'Agra' },
          status: 'ongoing',
          totalDistance: 230,
          totalExpense: 3800,
        },
        {
          _id: '3',
          vehicle: { vehicleNumber: 'MH03 EF 9012' },
          driver: { name: 'Mahesh Singh' },
          inquiry: { pickupLocation: 'Bangalore', dropLocation: 'Mysore' },
          status: 'completed',
          totalDistance: 145,
          totalExpense: 2200,
        },
      ],
    };
  },
};

export const mockRoles = {
  getMyPermissions: async () => {
    return {
      permissions: [
        { module: 'dashboard', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'vehicles', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'drivers', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'trips', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'inquiries', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'expenses', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'reports', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'documents', canView: true, canCreate: true, canEdit: true, canDelete: true },
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
        { module: 'roleManagement', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'userManagement', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { module: 'settings', canView: true, canCreate: true, canEdit: true, canDelete: true },
      ],
      level: 1,
    };
  },
};

// Helper to simulate network delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
