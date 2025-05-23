import { API_URL } from '@/config';

export type BankType = 'KASPI' | 'HALYK' | 'HOME' | 'FORTE' | 'EURASIAN' | 'JUSAN' | 'RBK';

// Response types
export interface BankConnection {
  id: string;
  merchantId: string;
  bankType: BankType;
  redirectUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicBank {
  type: BankType;
  name: string;
  redirectUrl: string;
}

// Create or update a bank connection
export async function connectBank(bankType: BankType, redirectUrl: string): Promise<BankConnection> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Не авторизован. Пожалуйста, войдите в систему.');
    }
    
    const response = await fetch(`${API_URL}/merchant/banks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({
        bankType,
        redirectUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to connect bank: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error connecting bank:', error);
    throw error;
  }
}

// Get all bank connections for current merchant
export async function getBankConnections(): Promise<BankConnection[]> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Не авторизован. Пожалуйста, войдите в систему.');
    }
    
    const response = await fetch(`${API_URL}/merchant/banks`, {
      method: 'GET',
      headers: {
        'Authorization': token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to get bank connections: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting bank connections:', error);
    throw error;
  }
}

// Get public banks for merchant by slug (no authentication required)
export async function getPublicBanksByMerchantSlug(merchantSlug: string): Promise<PublicBank[]> {
  try {
    const response = await fetch(`${API_URL}/public/${merchantSlug}/banks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Merchant not found');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to get merchant banks: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting public banks:', error);
    throw error;
  }
}

// Delete a bank connection
export async function deleteBankConnection(id: string): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Не авторизован. Пожалуйста, войдите в систему.');
    }
    
    const response = await fetch(`${API_URL}/merchant/banks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete bank connection: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting bank connection:', error);
    throw error;
  }
}

// Disconnect a bank by its type
export async function disconnectBank(bankType: BankType): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Не авторизован. Пожалуйста, войдите в систему.');
    }
    
    const response = await fetch(`${API_URL}/merchant/banks/${bankType}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to disconnect bank: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error disconnecting bank:', error);
    throw error;
  }
} 