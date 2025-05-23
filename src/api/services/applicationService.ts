import axiosClient from '../axiosClient';
import { ApplicationStatus } from '@/utils/statusMappings';

// Types for application data
export interface Application {
  id: string; // shortId для отображения (например "#123")
  originalId: string; // оригинальный UUID для API запросов
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

// API filter params interface
export interface ApplicationFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  period?: 'day' | 'yesterday' | 'week' | 'month';
  date_from?: string;
  date_to?: string;
  client_name?: string; // Renamed from search to client_name for backend API compatibility
  shortId?: number; // Added for searching by application ID (shown as just ID on frontend)
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

// Single application response type
export interface SingleApplication {
  id: string;
  shortId: number;
  amount: number;
  loanType: string;
  term: number;
  status: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  iin: string;
  phone: string;
  preferredPaymentDay: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // Other fields that may be present
}

// Update application payload type
export interface UpdateApplicationPayload {
  loanType?: string;
  term?: number;
  amount?: number;
  iin?: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  phone?: string;
  preferredPaymentDay?: number;
  preferredPaymentDate?: number;
  redemptionMethod?: string;
  type?: string;
  [key: string]: any; // Other fields that may be needed
}

// Функция для преобразования статуса с бэкенда - теперь возвращает как есть
function mapApiStatusToApplicationStatus(apiStatus: string): string {
  // Возвращаем статус как есть, добавляем логирование
  console.log('Original API status:', apiStatus);
  return apiStatus;
}

// Applications service
const applicationService = {
  // Get list of applications with optional filtering
  getApplications: async (params?: ApplicationFilterParams) => {
    try {
      console.log('Requesting applications with params:', params);
      
      // If search is empty string, remove it to avoid API issues
      if (params?.client_name === '') {
        delete params.client_name;
      }
      
      // Handle shortId search parameter
      if (params?.shortId !== undefined) {
        // Make sure shortId is a number
        if (typeof params.shortId === 'string') {
          // If it's a string (e.g. "#123"), try to convert it to a number
          const idString = params.shortId as string;
          if (idString.startsWith('#')) {
            params.shortId = parseInt(idString.substring(1));
          } else {
            params.shortId = parseInt(idString);
          }
        }
        
        console.log('Searching by shortId:', params.shortId);
      }
      
      const response = await axiosClient.get('/applications', { params });
      
      // Check if we have the API formatted response
      if (response && 'data' in response && 'meta' in response) {
        console.log('API response format detected, transforming data');
        const apiResponse = response as ApiApplicationResponse;
        
        // Map the API response to our application model
        const applications = apiResponse.data.map(app => ({
          id: app.shortId ? `#${app.shortId}` : app.id, // Use shortId if available, fallback to UUID
          originalId: app.id, // Сохраняем оригинальный UUID для API запросов
          customerName: `${app.firstName} ${app.lastName}`,
          amount: app.amount,
          status: mapApiStatusToApplicationStatus(app.status),
          date: new Date(app.createdAt).toLocaleDateString('ru-RU')
        }));
        
        console.log('Transformed applications:', applications);
        
        return {
          applications,
          total: apiResponse.meta.total
        } as ApplicationsResponse;
      }
      
      // Return the response directly if it already matches our expected format
      // Но преобразуем статусы к нашему формату
      console.log('Response already in expected format:', response);
      
      if (response && 'applications' in response) {
        // Fix typing issues by safely asserting data type
        const responseData = response as any;
        const applications = responseData.applications.map((app: any) => ({
          ...app,
          status: mapApiStatusToApplicationStatus(app.status)
        }));
        
        return {
          applications,
          total: responseData.total
        } as ApplicationsResponse;
      }
      
      // If we reach here, we need to convert the response to our format
      // This is a safer approach than just casting directly
      return {
        applications: [],
        total: 0
      } as ApplicationsResponse;
    } catch (error) {
      console.error('Error in getApplications:', error);
      throw error;
    }
  },

  // Get application metrics for dashboard
  getApplicationMetrics: async (params?: ApplicationFilterParams) => {
    try {
      // Try to get actual metrics from API endpoint
      try {
        const response = await axiosClient.get('/applications/metrics', { params });
        // Fix type casting by safely extracting data
        const data = response.data || response;
        return {
          totalAmount: data.totalAmount || 0,
          averageAmount: data.averageAmount || 0,
          totalApplications: data.totalApplications || 0
        } as ApplicationMetrics;
      } catch (metricsError) {
        console.log('Metrics endpoint failed, calculating from applications list:', metricsError);
        
        // If metrics endpoint doesn't exist, calculate from applications
        const applicationsResponse = await applicationService.getApplications(params);
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
  },

  // Get single application by ID
  getApplication: async (applicationId: string): Promise<SingleApplication> => {
    try {
      console.log('Fetching application with ID:', applicationId);
      const response = await axiosClient.get(`/applications/${applicationId}`);
      
      // Process the API response to match our expected format
      const data = response.data || response;
      
      // Map API response to our SingleApplication type
      const application = {
        ...data,
        status: mapApiStatusToApplicationStatus(data.status)
      };
      
      console.log('Application data fetched:', application);
      return application;
    } catch (error) {
      console.error('Error in getApplication:', error);
      throw error;
    }
  },
  
  // Update application data
  updateApplication: async (applicationId: string, payload: UpdateApplicationPayload): Promise<SingleApplication> => {
    try {
      console.log('Updating application with ID:', applicationId);
      console.log('Full payload being sent to API:', JSON.stringify(payload));
      
      const response = await axiosClient.put(`/applications/${applicationId}`, payload);
      
      // Process the API response to match our expected format
      const data = response.data || response;
      
      // Map API response to our SingleApplication type
      const updatedApplication = {
        ...data,
        status: mapApiStatusToApplicationStatus(data.status)
      };
      
      console.log('Application updated successfully:', updatedApplication);
      return updatedApplication;
    } catch (error) {
      console.error('Error in updateApplication:', error);
      throw error;
    }
  }
};

export default applicationService; 