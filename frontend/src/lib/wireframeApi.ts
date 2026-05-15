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
    if (url === '/roles/my-permissions') return createMockResponse(await mockRoles.getMyPermissions());

    // Dashboard
    if (url === '/dashboard/stats') return createMockResponse(await mockDashboard.getStats());

    // Vehicles
    if (url === '/vehicles') return createMockResponse(await mockVehicles.getAll());
    if (url.match(/\/vehicles\/.+/)) {
      const id = url.split('/').pop()!;
      return createMockResponse(await mockVehicles.getById(id));
    }

    // Drivers
    if (url === '/drivers') return createMockResponse(await mockDrivers.getAll());

    // Trips
    if (url === '/trips') return createMockResponse(await mockTrips.getAll());
    if (url.match(/\/trips\/.+/)) {
      const id = url.split('/').pop()!;
      return createMockResponse(await mockTrips.getById(id));
    }

    // Inquiries
    if (url === '/trip-inquiries') return createMockResponse(await mockInquiries.getAll());

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

    return createMockResponse({ message: 'Success' });
  },

  put: async () => {
    await delay(300);
    return createMockResponse({ message: 'Updated' });
  },

  delete: async () => {
    await delay(300);
    return createMockResponse({ message: 'Deleted' });
  },
};

export default wireframeApi;
