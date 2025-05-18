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
      return response as Merchant;
    } catch (error) {
      console.error('Error fetching merchant data:', error);
      // Пробрасываем ошибку дальше для обработки в компоненте
      // и чтобы сработал перехватчик в axiosClient для 401/403
      throw error;
    }
  },

  // Create application link for a specific merchant outlet
  createApplicationLink: async (merchantSlug: string, outletIndex: number) => {
    console.log(`Creating application link for: ${merchantSlug}, outlet: ${outletIndex}`);
    try {
      const response = await axiosClient.post(`/public/${merchantSlug}/${outletIndex}`);
      console.log('Application link created:', response);
      return response as ApplicationLink;
    } catch (error) {
      console.error('Error creating application link:', error);
      throw error;
    }
  }
};

export default merchantService; 