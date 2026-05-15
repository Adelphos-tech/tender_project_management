// Wireframe API - Mock data for static deployment
import {
  mockAuth,
  mockVehicles,
  mockDrivers,
  mockTrips,
  mockInquiries,
  mockDocuments,
  mockFundFlow,
  mockContractorBills,
  mockDashboard,
  mockRoles,
  mockTripInquiries,
  mockExpenses,
  mockReports,
  mockRolesExtended,
  mockUsers,
  delay,
} from './mockApi';

// Mock API wrapper that simulates HTTP responses
const createMockResponse = (data: any) => ({
  data,
  status: 200,
  statusText: 'OK',
});

// Wireframe API - replaces actual API calls with mock data
const wireframeApi = {
  get: async (url: string) => {
    await delay(300);

    // Auth routes
    if (url === '/auth/profile') return createMockResponse(await mockAuth.getProfile());
    if (url === '/auth/users') return createMockResponse(await mockUsers.getAll());
    if (url === '/roles/my-permissions') return createMockResponse(await mockRoles.getMyPermissions());

    // Dashboard
    if (url === '/dashboard/stats') return createMockResponse(await mockDashboard.getStats());

    // Vehicles
    if (url === '/vehicles') return createMockResponse(await mockVehicles.getAll());
    if (url === '/vehicles/available') return createMockResponse(await mockTripInquiries.getAvailableVehicles());
    if (url.match(/\/vehicles\/[^/]+$/) && !url.includes('available')) {
      const id = url.split('/').pop()!;
      return createMockResponse(await mockVehicles.getById(id));
    }

    // Drivers
    if (url === '/drivers') return createMockResponse(await mockDrivers.getAll());
    if (url === '/drivers/available') return createMockResponse(await mockTripInquiries.getAvailableDrivers());

    // Trips
    if (url === '/trips') return createMockResponse(await mockTrips.getAll());
    if (url.match(/\/trips\/[^/]+$/) && !url.includes('status')) {
      const id = url.split('/').pop()!;
      return createMockResponse(await mockTrips.getById(id));
    }

    // Trip Inquiries
    if (url === '/trip-inquiries') return createMockResponse(await mockTripInquiries.getAll());

    // Expenses
    if (url === '/expenses') return createMockResponse(await mockExpenses.getAll());

    // Reports
    if (url === '/reports/summary') return createMockResponse(await mockReports.getSummary());
    if (url === '/reports/detailed') return createMockResponse(await mockReports.getDetailed());

    // Roles
    if (url === '/roles') return createMockResponse(await mockRolesExtended.getRoles());
    if (url === '/roles/modules') return createMockResponse(await mockRolesExtended.getModules());

    // Documents
    if (url === '/documents') return createMockResponse(await mockDocuments.getAll());
    if (url.match(/\/documents\/.+/)) {
      const id = url.split('/').pop()!;
      return createMockResponse(await mockDocuments.getById(id));
    }

    // Fund Flow
    if (url === '/fund-flow') return createMockResponse(await mockFundFlow.getAll());
    if (url.match(/\/fund-flow\/project\/.+/)) {
      const id = url.split('/').pop()!;
      return createMockResponse(await mockFundFlow.getById(id));
    }

    // Contractor Bills
    if (url === '/contractor-bills') return createMockResponse(await mockContractorBills.getAll());
    if (url.match(/\/contractor-bills\/.+/)) {
      const id = url.split('/').pop()!;
      return createMockResponse(await mockContractorBills.getById(id));
    }

    return createMockResponse({});
  },

  post: async (url: string, data?: any) => {
    await delay(300);

    if (url === '/auth/login') return createMockResponse(await mockAuth.login(data.email, data.password));
    if (url === '/auth/register') return createMockResponse(await mockAuth.register(data));
    if (url === '/trip-inquiries') return createMockResponse({ _id: Date.now().toString(), ...data, status: 'pending' });
    if (url === '/expenses') return createMockResponse({ _id: Date.now().toString(), ...data });
    if (url === '/roles') return createMockResponse({ _id: Date.now().toString(), ...data });
    if (url === '/roles/init') return createMockResponse({
      message: 'System roles initialized',
      results: [
        { name: 'Admin', status: 'created' },
        { name: 'Manager', status: 'created' },
        { name: 'Staff', status: 'created' },
        { name: 'Driver', status: 'created' },
      ]
    });

    return createMockResponse({ message: 'Success' });
  },

  put: async (url: string, data?: any) => {
    await delay(300);

    // Trip inquiry status updates
    if (url.match(/\/trip-inquiries\/.+\/status/)) {
      return createMockResponse({ message: 'Status updated', status: data?.status });
    }

    // User updates
    if (url.match(/\/auth\/users\/.+/)) {
      return createMockResponse({ message: 'User updated', ...data });
    }

    // Role updates
    if (url.match(/\/roles\/.+/)) {
      return createMockResponse({ message: 'Role updated', ...data });
    }

    return createMockResponse({ message: 'Updated' });
  },

  delete: async (url: string) => {
    await delay(300);

    // Expense deletion
    if (url.match(/\/expenses\/.+/)) {
      return createMockResponse({ message: 'Expense deleted' });
    }

    // Role deletion
    if (url.match(/\/roles\/.+/)) {
      return createMockResponse({ message: 'Role deleted' });
    }

    return createMockResponse({ message: 'Deleted' });
  },
};

export default wireframeApi;
