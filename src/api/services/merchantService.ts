import axiosClient from '../axiosClient';

// Types for merchant data
export interface Outlet {
  index: number;
  name: string;
  address: string;
}

export interface Merchant {
  merchantId: string;
  publicId: string;
  slug: string;
  name: string;
  email: string;
  phone: string;
  bin: string;
  address: string;
  outlets: Outlet[];
}

// Types for merchant profile
export interface MerchantProfile {
  id: string;
  publicId: string;
  slug: string;
  companyName: string;
  bin: string;
  directorName: string;
  contactEmail: string;
  phoneNumber: string;
  website: string;
  address: string;
  bankBik: string;
  bankName: string;
  bankAccount: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMerchantProfileRequest {
  companyName: string;
  bin: string;
  directorName: string;
  contactEmail: string;
  phoneNumber: string;
  website: string;
  address: string;
  bankBik: string;
  bankName: string;
  bankAccount: string;
}

export interface ApplicationLink {
  applicationId: string;
  shortId: string;
  redirectUrl: string;
}

// Merchant service
const merchantService = {
  // Get current merchant information
  getCurrentMerchant: async () => {
    console.log('Calling getCurrentMerchant API at:', '/merchant/me');
    
    // Вывод информации о токене
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log('Current token in localStorage (merchant service):', token ? `${token.substring(0, 20)}...` : 'No token');
    }
    
    try {
      console.log('Sending merchant data request');
      const response = await axiosClient.get('/merchant/me');
      console.log('API response successfully received:', response);
      return response as unknown as Merchant;
    } catch (error) {
      console.error('Error fetching merchant data:', error);
      // Пробрасываем ошибку дальше для обработки в компоненте
      // и чтобы сработал перехватчик в axiosClient для 401/403
      throw error;
    }
  },

  // Get merchant profile
  getMerchantProfile: async (): Promise<MerchantProfile | null> => {
    console.log('Calling getMerchantProfile API at:', '/merchant/profile');
    
    // Log current token status
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log('Token status:', token ? 'Token exists' : 'No token found');
      if (token) {
        console.log('Token preview:', token.substring(0, 30) + '...');
      }
    }
    
    try {
      console.log('Sending merchant profile request');
      const response = await axiosClient.get('/merchant/profile');
      console.log('Merchant profile received:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', response ? Object.keys(response) : 'Response is falsy');
      
      // Check if response exists (axiosClient already returns response.data)
      if (!response) {
        console.warn('API returned empty response, using default values');
        return null;
      }
      
      return response as unknown as MerchantProfile;
    } catch (error) {
      console.error('Error fetching merchant profile:', error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      // Return null instead of throwing error to allow app to work with defaults
      console.warn('Returning null due to API error, app will use default values');
      return null;
    }
  },

  // Update merchant profile
  updateMerchantProfile: async (profileData: UpdateMerchantProfileRequest): Promise<MerchantProfile> => {
    console.log('Calling updateMerchantProfile API at:', '/merchant/profile');
    console.log('Profile data to update:', profileData);
    
    try {
      const response = await axiosClient.put('/merchant/profile', profileData);
      console.log('Merchant profile updated:', response);
      return response as unknown as MerchantProfile;
    } catch (error) {
      console.error('Error updating merchant profile:', error);
      throw error;
    }
  },

  // Create application link for a specific merchant outlet
  createApplicationLink: async (merchantSlug: string, outletIndex: number) => {
    console.log(`Creating application link for: ${merchantSlug}, outlet: ${outletIndex}`);
    try {
      const response = await axiosClient.post(`/public/${merchantSlug}/${outletIndex}`);
      console.log('Application link created:', response);
      return response as unknown as ApplicationLink;
    } catch (error) {
      console.error('Error creating application link:', error);
      throw error;
    }
  }
};

export default merchantService; 