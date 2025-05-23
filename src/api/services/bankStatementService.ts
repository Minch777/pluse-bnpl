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
      // 1. If ScanQR exists with Status "OK" - most reliable indicator
      // 2. API should return success: true
      // 3. No explicit error codes/messages
      let isSuccessful = false;
      
      // First try to find success based on ScanQR status (most reliable indicator)
      if (apiData.ScanQR && apiData.ScanQR.length > 0 && apiData.ScanQR[0].Status === "OK") {
        console.log('Found ScanQR with Status OK - considering successful');
        isSuccessful = true;
      } else if (apiData.success === true) {
        console.log('Using API success field');
        // API says success, now check for business logic errors
        const hasErrors = !!(apiData.ErrorCode || apiData.ErrorMessage);
        if (!hasErrors) {
          isSuccessful = true;
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
        
        // Add detailed logging of the entire error.response structure
        console.log('Full error.response structure:', {
          data: error.response.data,
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          config: error.response.config
        });
        
        // Check if success is at the top level of error.response
        console.log('Checking success field locations:', {
          'error.response.success': error.response.success,
          'error.response.data.success': error.response.data?.success,
          'error.response.data type': typeof error.response.data,
          'error.response.data keys': error.response.data ? Object.keys(error.response.data) : 'no data'
        });
        
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
          
          // First try to find success based on ScanQR status (most reliable indicator)
          if (apiData.ScanQR && apiData.ScanQR.length > 0 && apiData.ScanQR[0].Status === "OK") {
            console.log('Found ScanQR with Status OK - considering successful');
            isSuccessful = true;
          } else if (apiData.success === true) {
            // Fallback to API success field
            console.log('Using API success field');
            const hasErrors = !!(apiData.ErrorCode || apiData.ErrorMessage);
            if (!hasErrors) {
              isSuccessful = true;
            }
          } else {
            // Check if the entire error.response has success field
            if (error.response.success === true) {
              console.log('Found success at error.response level');
              const hasErrors = !!(apiData.ErrorCode || apiData.ErrorMessage);
              if (!hasErrors) {
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