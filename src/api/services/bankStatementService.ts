import axiosClient from '../axiosClient';

// Response type for bank statement check
export interface BankStatementCheckResponse {
  success: boolean;
  data?: {
    ScanQR?: Array<{
      Status: string;
      Date: string;
      IIN: string;
      ID: string;
    }>;
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
      
      // Process the response data regardless of status (since sometimes status is undefined)
      const apiData = response.data || {};
      
      console.log('Analyzing API response for success determination:', {
        apiDataSuccess: apiData.success,
        hasErrorCode: !!apiData.ErrorCode,
        hasErrorMessage: !!apiData.ErrorMessage,
        scanQRStatus: apiData.ScanQR?.[0]?.Status,
        fullApiData: apiData
      });
      
      // Determine success based on multiple factors:
      // 1. API should return success: true
      // 2. No explicit error codes/messages
      // 3. If ScanQR exists, it should have Status: "OK"
      let isSuccessful = false;
      
      if (apiData.success === true) {
        // API says success, now check for business logic errors
        const hasErrors = !!(apiData.ErrorCode || apiData.ErrorMessage);
        
        if (!hasErrors) {
          // No explicit errors, check ScanQR status if available
          if (apiData.ScanQR && apiData.ScanQR.length > 0) {
            // If ScanQR exists, check its status
            isSuccessful = apiData.ScanQR[0].Status === "OK";
          } else {
            // No ScanQR data, but API says success and no errors - consider successful
            isSuccessful = true;
          }
        }
      }
      
      console.log('Final success determination:', isSuccessful);
      
      const result: BankStatementCheckResponse = {
        success: isSuccessful,
        data: apiData,
        // Don't spread apiData here as it might override our success value
        message: apiData.message,
        error: apiData.error
      };
      
      console.log('Processed bank statement response:', result);
      return result;
    } catch (error: any) {
      console.error('Error in checkBankStatement:', error);
      
      // Log detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        
        // Check if we have data in the error response
        const apiData = error.response.data;
        if (apiData) {
          console.log('Found data in error response, processing it:', apiData);
          
          console.log('Analyzing API response for success determination (from error response):', {
            apiDataSuccess: apiData.success,
            hasErrorCode: !!apiData.ErrorCode,
            hasErrorMessage: !!apiData.ErrorMessage,
            scanQRStatus: apiData.ScanQR?.[0]?.Status,
            fullApiData: apiData
          });
          
          // Determine success based on the same logic as in try block
          let isSuccessful = false;
          
          if (apiData.success === true) {
            // API says success, now check for business logic errors
            const hasErrors = !!(apiData.ErrorCode || apiData.ErrorMessage);
            
            if (!hasErrors) {
              // No explicit errors, check ScanQR status if available
              if (apiData.ScanQR && apiData.ScanQR.length > 0) {
                // If ScanQR exists, check its status
                isSuccessful = apiData.ScanQR[0].Status === "OK";
              } else {
                // No ScanQR data, but API says success and no errors - consider successful
                isSuccessful = true;
              }
            }
          }
          
          console.log('Final success determination (from error response):', isSuccessful);
          
          const result: BankStatementCheckResponse = {
            success: isSuccessful,
            data: apiData,
            message: apiData.message,
            error: apiData.error
          };
          
          console.log('Processed bank statement response (from error response):', result);
          return result;
        }
      }
      
      // If no usable data in error response, throw the original error
      throw error;
    }
  }
};

export default bankStatementService; 