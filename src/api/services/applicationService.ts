import axiosClient from '../axiosClient';

// Types for application data
export interface Application {
  id: string;
  customerName: string;
  amount: number;
  status: string;
  date: string;
}

export interface ApplicationsResponse {
  applications: Application[];
  total: number;
}

export interface ApplicationMetrics {
  totalAmount: number;
  averageAmount: number;
  totalApplications: number;
}

// Shape of the API response
interface ApiApplicationResponse {
  data: {
    id: string;
    shortId: number;
    amount: number;
    status: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    createdAt: string;
    [key: string]: any; // Other fields may be present
  }[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

// Applications service
const applicationService = {
  // Get list of applications with optional filtering
  getApplications: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    try {
      console.log('Requesting applications with params:', params);
      const response = await axiosClient.get('/applications', { params });
      
      // Check if we have the API formatted response
      if (response && 'data' in response && 'meta' in response) {
        console.log('API response format detected, transforming data');
        const apiResponse = response as ApiApplicationResponse;
        
        // Map the API response to our application model
        const applications = apiResponse.data.map(app => ({
          id: app.shortId ? `#${app.shortId}` : app.id, // Use shortId if available, fallback to UUID
          customerName: `${app.firstName} ${app.lastName}`,
          amount: app.amount,
          status: app.status,
          date: new Date(app.createdAt).toLocaleDateString('ru-RU')
        }));
        
        console.log('Transformed applications:', applications);
        
        return {
          applications,
          total: apiResponse.meta.total
        } as ApplicationsResponse;
      }
      
      // Return the response directly if it already matches our expected format
      console.log('Response already in expected format:', response);
      return response as ApplicationsResponse;
    } catch (error) {
      console.error('Error in getApplications:', error);
      throw error;
    }
  },

  // Get application metrics for dashboard
  getApplicationMetrics: async () => {
    try {
      // Try to get actual metrics from API endpoint
      try {
        const response = await axiosClient.get('/applications/metrics');
        return response as ApplicationMetrics;
      } catch (metricsError) {
        console.log('Metrics endpoint failed, calculating from applications list:', metricsError);
        
        // If metrics endpoint doesn't exist, calculate from applications
        const applicationsResponse = await applicationService.getApplications();
        const applications = applicationsResponse.applications;
        
        if (!applications || applications.length === 0) {
          return {
            totalAmount: 0,
            averageAmount: 0,
            totalApplications: 0
          };
        }
        
        const totalAmount = applications.reduce((sum, app) => sum + app.amount, 0);
        const averageAmount = totalAmount / applications.length;
        
        return {
          totalAmount,
          averageAmount,
          totalApplications: applications.length
        };
      }
    } catch (error) {
      console.error('Error in getApplicationMetrics:', error);
      throw error;
    }
  }
};

export default applicationService; 