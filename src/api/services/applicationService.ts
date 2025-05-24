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
  period?: 'today' | 'yesterday' | 'week' | 'month';
  date_from?: string;
  date_to?: string;
  client_name?: string;
  shortId?: number;
  search?: string;
  min_amount?: number;
  max_amount?: number;
  loan_type?: string;
  merchant_search?: string;
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

// Shape of the API response for admin
interface AdminApiResponse {
  data: Array<{
    id: string;
    shortId: number;
    amount: number;
    status: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    createdAt: string;
    updatedAt: string;
    merchantId: string;
    merchantName: string;
    merchantBin: string;
    loanType: string;
    term: number;
    iin: string;
    phone: string;
  }>;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

// Applications service
const applicationService = {
  // Get list of applications with optional filtering (for merchants)
  getApplications: async (params?: ApplicationFilterParams) => {
    try {
      console.log('Requesting merchant applications with params:', params);
      
      // If search is empty string, remove it to avoid API issues
      if (params?.client_name === '') {
        delete params.client_name;
      }
      
      // Handle shortId search parameter
      if (params?.shortId !== undefined) {
        // Make sure shortId is a number
        if (typeof params.shortId === 'string') {
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
      
      // Process response...
      if (response && 'data' in response && 'meta' in response) {
        console.log('API response format detected, transforming data');
        const apiResponse = response as ApiApplicationResponse;
        
        const applications = apiResponse.data.map(app => ({
          id: app.shortId ? `#${app.shortId}` : app.id,
          originalId: app.id,
          customerName: `${app.firstName} ${app.lastName}`,
          amount: app.amount,
          status: mapApiStatusToApplicationStatus(app.status),
          date: new Date(app.createdAt).toLocaleDateString('ru-RU')
        }));
        
        return {
          applications,
          total: apiResponse.meta.total
        } as ApplicationsResponse;
      }
      
      if (response && 'applications' in response) {
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
      
      return {
        applications: [],
        total: 0
      } as ApplicationsResponse;
    } catch (error) {
      console.error('Error in getApplications:', error);
      throw error;
    }
  },

  // Get list of applications for admin panel
  getAdminApplications: async (params?: ApplicationFilterParams) => {
    try {
      console.log('=== APPLICATION SERVICE ===');
      console.log('Requesting admin applications with params:', params);
      console.log('Date from:', params?.date_from);
      console.log('Date to:', params?.date_to);
      
      // Filter out undefined values
      const cleanParams = Object.entries(params || {}).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
      
      console.log('Clean params being sent:', cleanParams);
      
      const response = await axiosClient.get<AdminApiResponse>('/applications/admin/all', { params: cleanParams });
      console.log('Admin applications response:', response);

      if (response && typeof response === 'object' && 'data' in response) {
        const data = response.data;
        const applications = Array.isArray(data) ? data.map(app => ({
          ...app,
          clientName: `${app.firstName} ${app.lastName}${app.middleName ? ' ' + app.middleName : ''}`.trim()
        })) : [];

        return {
          applications,
          total: response.meta?.total || applications.length
        };
      }

      // Если структура ответа не соответствует ожидаемой
      console.warn('Unexpected response format:', response);
      return {
        applications: [],
        total: 0
      };
    } catch (error) {
      console.error('Error in getAdminApplications:', error);
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