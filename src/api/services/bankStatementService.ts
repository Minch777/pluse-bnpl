import axiosClient from '../axiosClient';

// Response type for bank statement check
export interface BankStatementCheckResponse {
  success: boolean;
  data?: {
    scoreRb?: {
      status: string;
      date: string;
      iin: string;
      id: string;
    };
    fileName?: string;
    fileCreateDateTime?: string;
    fileChangeDateTime?: string;
    fileLoadDateTime?: string;
    endDate?: string;
    id?: string;
    // Error fields that can be present when there's an error
    ErrorCode?: number;
    ErrorMessage?: string;
  };
  // For backwards compatibility
  message?: string;
  error?: string;
  [key: string]: any;
}

// Bank statement service
const bankStatementService = {
  // Check bank statement
  checkStatement: async (
    type: 'kaspi' | 'halyk',
    iin: string,
    statement: File,
    applicationId: string
  ): Promise<BankStatementCheckResponse> => {
    try {
      console.log('Checking bank statement:', { 
        type, 
        iin, 
        fileName: statement.name,
        applicationId 
      });
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('iin', iin);
      formData.append('statement', statement);
      formData.append('applicationId', applicationId);
      
      console.log('FormData prepared for bank statement check with applicationId:', applicationId);
      
      const response = await axiosClient.post(
        `/applications/check-statement/${type}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('Bank statement check response:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);
      
      // Return the response data
      return response.data || response;
    } catch (error) {
      console.error('Error in checkBankStatement:', error);
      
      // Log detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      }
      
      throw error;
    }
  }
};

export default bankStatementService; 