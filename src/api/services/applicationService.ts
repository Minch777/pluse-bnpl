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

// Applications service
const applicationService = {
  // Get list of applications with optional filtering
  getApplications: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    try {
      const response = await axiosClient.get('/applications', { params });
      return response as ApplicationsResponse;
    } catch (error) {
      throw error;
    }
  },

  // Get application metrics for dashboard
  getApplicationMetrics: async () => {
    try {
      const response = await axiosClient.get('/applications/metrics');
      return response as ApplicationMetrics;
    } catch (error) {
      throw error;
    }
  }
};

export default applicationService; 