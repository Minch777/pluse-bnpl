'use client';
// Cache-busting comment - update v1

import { useState, useContext, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ChevronLeftIcon, DocumentArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { SidebarContext } from '@/app/merchant/layout';
import applicationService, { SingleApplication, UpdateApplicationPayload } from '@/api/services/applicationService';
import bankStatementService, { BankStatementCheckResponse } from '@/api/services/bankStatementService';
import StatusBadge from '@/components/StatusBadge';
import { ApplicationStatus } from '@/utils/statusMappings';
import axiosClient from '@/api/axiosClient';

// Modern color palette
const colors = {
  primary: '#0284C7', // sky-600
  primaryDark: '#0369A1', // sky-700
  primaryLight: '#E0F2FE', // sky-100
  secondary: '#0EA5E9', // sky-500
  secondaryDark: '#0284C7', // sky-600
  gradient: {
    from: '#0EA5E9', // sky-500
    to: '#0284C7', // sky-600
  },
  success: '#10B981', // emerald-500
  error: '#EF4444', // red-500
  neutral: '#F1F5F9', // slate-100
  text: {
    primary: '#0F172A', // slate-900
    secondary: '#475569', // slate-600
    tertiary: '#94A3B8' // slate-400
  }
};

// Add custom animation for progress bar
const progressAnimation = `
@keyframes progress {
  0% { width: 0%; }
  100% { width: 100%; }
}

.animate-progress {
  animation: progress 1.5s ease-in-out infinite;
}
`;

// Types for the form data
type LoanType = 'credit' | 'installment';
type BankType = 'kaspi' | 'halyk';
type FormData = {
  // Step 1: Product Selection
  loanType: LoanType;
  term: number;
  amount: number | string;
  
  // Step 2: Client Data
  iin: string;
  lastName: string;
  firstName: string;
  middleName: string;
  phone: string;
  preferredPaymentDay: number;
  
  // Step 3: Document Upload
  document: File | null;
  bankType: BankType;
  
  // Step 4: OTP Verification
  otp: string;
};

// Форматирование суммы с разделением по разрядам
const formatNumberWithSpaces = (value: number | string): string => {
  if (!value && value !== 0) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Обратное преобразование из форматированной строки в число
const parseFormattedNumber = (value: string): number => {
  return Number(value.replace(/\s+/g, ''));
};

export default function ApplicationPage({ 
  params 
}: { 
  params: { 
    slug: string; 
    outletIndex: string;
    applicationId: string;
  } 
}) {
  // Current step state
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    loanType: 'installment',
    term: 3,
    amount: 10000,
    iin: '',
    lastName: '',
    firstName: '',
    middleName: '',
    phone: '+7',
    preferredPaymentDay: 10,
    document: null,
    bankType: 'kaspi',
    otp: '',
  });
  
  // Application data from API
  const [applicationData, setApplicationData] = useState<SingleApplication | null>(null);
  
  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Step-specific loading and success states
  const [isUpdating, setIsUpdating] = useState(false); // For API update loading
  const [updateSuccess, setUpdateSuccess] = useState(false); // For success message

  // Application status (for step 5)
  const [applicationStatus, setApplicationStatus] = useState<'approved' | 'pending' | 'rejected'>('pending');
  
  // Document upload state
  const [documentName, setDocumentName] = useState<string>('');
  
  // Skip confirmation modal state
  const [showSkipModal, setShowSkipModal] = useState(false);
  
  // OTP resend timer
  const [resendTimer, setResendTimer] = useState(0);
  
  // Invalid OTP error
  const [otpError, setOtpError] = useState('');
  
  // Instructions modal state
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  
  // Bank statement check states
  const [isCheckingStatement, setIsCheckingStatement] = useState(false);
  const [statementCheckResult, setStatementCheckResult] = useState<BankStatementCheckResponse | null>(null);
  const [statementCheckError, setStatementCheckError] = useState<string | null>(null);
  
  // Fetch application data on mount
  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        setLoading(true);
        const data = await applicationService.getApplication(params.applicationId);
        setApplicationData(data);
        
        // Determine the correct loan type from API response
        let loanType: LoanType = 'installment';
        if (data.type === 'LOAN' || data.loanType?.toLowerCase() === 'credit') {
          loanType = 'credit';
        }
        
        console.log('API data loaded:', {
          type: data.type, 
          loanType: data.loanType,
          determinedLoanType: loanType
        });
        
        // Initialize form data from API response - but only for step 1
        // Step 2 should always start fresh with empty fields
        setFormData(prevFormData => ({
          ...prevFormData,
          loanType: loanType,
          term: data.term || 3,
          amount: data.amount || 10000,
          // Don't pre-populate step 2 fields - users should enter these from scratch
          iin: '',
          lastName: '',
          firstName: '',
          middleName: '',
          phone: '+7',
          preferredPaymentDay: 10,
        }));
        
        // Set application status if available
        if (data.status) {
          if (data.status === 'BANK_APPROVED') {
            setApplicationStatus('approved');
          } else if (data.status === 'BANK_REJECTED') {
            setApplicationStatus('rejected');
          } else {
            setApplicationStatus('pending');
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch application data:', err);
        setError('Не удалось загрузить данные заявки. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplicationData();
  }, [params.applicationId]);
  
  // Validate current step
  useEffect(() => {
    validateCurrentStep();
  }, [formData, currentStep]);
  
  // Start resend timer
  useEffect(() => {
    if (currentStep === 4 && resendTimer === 0) {
      // Set initial timer when first arriving at OTP screen
      setResendTimer(60);
    }
  }, [currentStep]);
  
  // Reset timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);
  
  // Verify OTP using the sign endpoint when 6 digits are entered
  useEffect(() => {
    if (currentStep === 4 && formData.otp.length === 6) {
      // Immediately verify without auto-proceeding
      const verifyOTP = async () => {
        try {
          setLoading(true);
          console.log('Verifying OTP code:', formData.otp);
          
          const response = await axiosClient.post(`/applications/${params.applicationId}/sign`, {
            otp: formData.otp
          });
          
          console.log('OTP verification response:', response);
          
          // Clear any previous error
          setOtpError('');
          
          // Short delay before proceeding
          setTimeout(() => {
            handleNext();
          }, 500);
        } catch (error: any) {
          console.error('OTP verification error:', error);
          setOtpError(error.message || 'Неверный код подтверждения. Пожалуйста, проверьте и попробуйте снова.');
        } finally {
          setLoading(false);
        }
      };
      
      verifyOTP();
    }
  }, [formData.otp, currentStep, params.applicationId]);
  
  // Helper function to generate date error message
  const getDateErrorMessage = () => {
    const currentDate = new Date().toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    return `Пожалуйста, загрузите актуальную выписку с данными по ${currentDate}. Вы можете продолжить оформление заявки без добавления выписки.`;
  };
  
  // Auto-check bank statement when IIN is entered after file upload
  useEffect(() => {
    const checkStatementAfterIinEntry = async () => {
      // Only check if we have a document, IIN, but no existing result/error/checking state
      if (formData.document && formData.iin && !statementCheckResult && !statementCheckError && !isCheckingStatement) {
        console.log('Auto-checking bank statement after IIN entry');
        try {
          setIsCheckingStatement(true);
          setStatementCheckError(null);
          setStatementCheckResult(null);
          
          console.log('Checking bank statement after IIN entry:', {
            type: formData.bankType,
            iin: formData.iin,
            fileName: formData.document.name
          });
          
          const checkResult = await bankStatementService.checkStatement(
            formData.bankType,
            formData.iin,
            formData.document,
            params.applicationId
          );
          
          console.log('Bank statement auto-check result:', checkResult);
          console.log('Checking for errors in API response:', {
            hasData: !!checkResult.data,
            hasErrorCode: !!checkResult.data?.ErrorCode,
            errorCode: checkResult.data?.ErrorCode,
            hasErrorMessage: !!checkResult.data?.ErrorMessage,
            errorMessage: checkResult.data?.ErrorMessage,
            success: checkResult.success
          });
          
          // Check if there are errors in data first (business logic errors)
          if (checkResult.data?.ErrorCode || checkResult.data?.ErrorMessage) {
            const errorMessage = checkResult.data.ErrorMessage || 'Ошибка при проверке выписки';
            console.log('API returned business logic error:', checkResult.data.ErrorCode, errorMessage);
            throw new Error(errorMessage);
          }
          
          // Then check if the response indicates technical success
          if (!checkResult.success) {
            const errorMessage = checkResult.message || checkResult.error || 'Ошибка при проверке выписки';
            console.log('API returned success: false, treating as error:', errorMessage);
            throw new Error(errorMessage);
          }
          
          console.log('Bank statement check successful, setting result');
          setStatementCheckResult(checkResult);
          
        } catch (statementError: any) {
          console.error('Error auto-checking bank statement after IIN entry:', statementError);
          console.log('Error details:', {
            errorMessage: statementError.message,
            errorName: statementError.name,
            fullError: statementError
          });
          
          // Handle specific error types
          let errorMessage = '';
          console.log('Checking error message for date-related keywords:', {
            message: statementError.message,
            includesДата: statementError.message?.includes('дата'),
            includesPeriod: statementError.message?.includes('period'),
            includesУстарела: statementError.message?.includes('устарела'),
            includesDate: statementError.message?.includes('date'),
            includesWrongDate: statementError.message?.includes('wrong date')
          });
          
          if (statementError.message && (statementError.message.includes('дата') || 
              statementError.message.includes('period') ||
              statementError.message.includes('устарела') ||
              statementError.message.includes('date') ||
              statementError.message.includes('wrong date'))) {
            errorMessage = getDateErrorMessage();
            console.log('Setting date-related error message');
          } else {
            errorMessage = 'Не удалось обработать выписку. Не беспокойтесь, вы можете продолжить без неё — это не повлияет на рассмотрение заявки.';
            console.log('Setting generic error message');
          }
          
          console.log('Final error message to display:', errorMessage);
          setStatementCheckError(errorMessage);
        } finally {
          setIsCheckingStatement(false);
        }
      }
    };

    // Add a small delay to avoid multiple rapid checks
    const timeoutId = setTimeout(checkStatementAfterIinEntry, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.iin, formData.document, formData.bankType, statementCheckResult, statementCheckError, isCheckingStatement, params.applicationId]);
  
  // Handle form field changes
  const handleChange = (field: keyof FormData, value: any) => {
    // Special case for amount - if value is empty string or 0, allow empty field
    if (field === 'amount' && (value === '' || value === 0)) {
      setFormData(prev => ({ ...prev, [field]: '' }));
      return;
    }
    
    // Log when loan type changes to credit
    if (field === 'loanType') {
      console.log('Loan type changed to:', value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for the field if showErrors is true
    if (showErrors && errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Handle OTP change with validation
  const handleOtpChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    handleChange('otp', numericValue);
    
    // Clear error when OTP is being entered
    if (otpError) {
      setOtpError('');
    }
  };
  
  // Handle resend OTP
  const handleResendOtp = () => {
    if (resendTimer === 0) {
      // Actually send a new OTP code
      setResendTimer(60);
      sendOtpCode()
        .then(success => {
          if (success) {
            console.log('Resent OTP successfully');
            // No need for alert as we set the timer already
          } else {
            console.error('Failed to resend OTP');
            setOtpError('Не удалось отправить новый код. Пожалуйста, попробуйте позже.');
          }
        })
        .catch(error => {
          console.error('Error resending OTP:', error);
          setOtpError('Не удалось отправить новый код. Пожалуйста, попробуйте позже.');
        });
    }
  };
  
  // Handle document upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, document: 'Размер файла не должен превышать 10MB' }));
        return;
      }
      
      // Validate file type - only PDF
      const validTypes = ['application/pdf'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, document: 'Разрешены только PDF файлы' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, document: file }));
      setDocumentName(file.name);
      
      // Clear document error
      if (errors.document) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.document;
          return newErrors;
        });
      }

      // Automatically check bank statement if IIN is available
      if (formData.iin) {
        console.log('Auto-checking bank statement after upload');
        try {
          setIsCheckingStatement(true);
          setStatementCheckError(null);
          setStatementCheckResult(null);
          
          console.log('Checking bank statement:', {
            type: formData.bankType,
            iin: formData.iin,
            fileName: file.name
          });
          
          const checkResult = await bankStatementService.checkStatement(
            formData.bankType,
            formData.iin,
            file,
            params.applicationId
          );
          
          console.log('Bank statement auto-check result:', checkResult);
          console.log('Checking for errors in API response:', {
            hasData: !!checkResult.data,
            hasErrorCode: !!checkResult.data?.ErrorCode,
            errorCode: checkResult.data?.ErrorCode,
            hasErrorMessage: !!checkResult.data?.ErrorMessage,
            errorMessage: checkResult.data?.ErrorMessage,
            success: checkResult.success
          });
          
          // Check if there are errors in data first (business logic errors)
          if (checkResult.data?.ErrorCode || checkResult.data?.ErrorMessage) {
            const errorMessage = checkResult.data.ErrorMessage || 'Ошибка при проверке выписки';
            console.log('API returned business logic error:', checkResult.data.ErrorCode, errorMessage);
            throw new Error(errorMessage);
          }
          
          // Then check if the response indicates technical success
          if (!checkResult.success) {
            const errorMessage = checkResult.message || checkResult.error || 'Ошибка при проверке выписки';
            console.log('API returned success: false, treating as error:', errorMessage);
            throw new Error(errorMessage);
          }
          
          console.log('Bank statement check successful, setting result');
          setStatementCheckResult(checkResult);
          
        } catch (statementError: any) {
          console.error('Error auto-checking bank statement:', statementError);
          console.log('Error details:', {
            errorMessage: statementError.message,
            errorName: statementError.name,
            fullError: statementError
          });
          
          // Handle specific error types
          let errorMessage = '';
          console.log('Checking error message for date-related keywords:', {
            message: statementError.message,
            includesДата: statementError.message?.includes('дата'),
            includesPeriod: statementError.message?.includes('period'),
            includesУстарела: statementError.message?.includes('устарела'),
            includesDate: statementError.message?.includes('date'),
            includesWrongDate: statementError.message?.includes('wrong date')
          });
          
          if (statementError.message && (statementError.message.includes('дата') || 
              statementError.message.includes('period') ||
              statementError.message.includes('устарела') ||
              statementError.message.includes('date') ||
              statementError.message.includes('wrong date'))) {
            errorMessage = getDateErrorMessage();
            console.log('Setting date-related error message');
          } else {
            errorMessage = 'Не удалось обработать выписку. Не беспокойтесь, вы можете продолжить без неё — это не повлияет на рассмотрение заявки.';
            console.log('Setting generic error message');
          }
          
          console.log('Final error message to display:', errorMessage);
          setStatementCheckError(errorMessage);
        } finally {
          setIsCheckingStatement(false);
        }
      } else {
        // If no IIN available, show info that check will happen later
        console.log('IIN not available, statement will be checked later');
      }
    }
  };
  
  // Remove uploaded document
  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, document: null }));
    setDocumentName('');
    // Reset statement check results when removing file
    setStatementCheckResult(null);
    setStatementCheckError(null);
  };
  
  // Format phone number with mask
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Apply +7 format
    if (digits.length <= 1) {
      return '+7';
    } else if (digits.length <= 4) {
      return `+7 (${digits.slice(1)}`;
    } else if (digits.length <= 7) {
      return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    } else if (digits.length <= 9) {
      return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    } else {
      return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
    }
  };
  
  // Convert formatted phone number to international format for API
  const formatPhoneForApi = (formattedPhone: string) => {
    // Remove all non-digits except the plus sign
    return formattedPhone.replace(/[^+\d]/g, '');
  };
  
  // Handle phone number input
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(event.target.value);
    handleChange('phone', formattedPhone);
  };
  
  // Format currency (tenge)
  const formatCurrency = (value: number | string) => {
    // Convert string to number if needed
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Check if it's a valid number
    if (isNaN(numValue)) {
      return '0 ₸';
    }
    
    return new Intl.NumberFormat('ru-KZ', {
      style: 'currency',
      currency: 'KZT',
      maximumFractionDigits: 0,
    }).format(numValue);
  };
  
  // Validate IIN (Kazakhstani ID)
  const validateIIN = (iin: string) => {
    // Check if it's exactly 12 digits
    if (!/^\d{12}$/.test(iin)) {
      return false;
    }
    
    // Additional validation can be added here
    // For now, we'll just check the length
    return true;
  };
  
  // Validate form based on current step but don't set errors yet
  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 1: // Product selection
        if (formData.amount === '') {
          newErrors.amount = 'Сумма должна быть указана';
        } else if (typeof formData.amount === 'number' && formData.amount < 10000) {
          newErrors.amount = 'Сумма должна быть не менее 10 000 ₸';
        } else if (typeof formData.amount === 'number' && formData.amount > 3000000) {
          newErrors.amount = 'Сумма не должна превышать 3 000 000 ₸';
        }
        break;
        
      case 2: // Client data
        // For step 2, we'll only validate when the user tries to proceed
        break;
        
      case 3: // Document upload - now optional
        // No validation needed since document is optional
        break;
        
      case 4: // OTP verification
        if (!formData.otp || formData.otp.length !== 6) {
          newErrors.otp = 'Введите 6-значный код из СМС';
        }
        break;
    }
    
    // Only update errors if showErrors is true
    if (showErrors) {
      setErrors(newErrors);
    }
    
    setIsFormValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  };
  
  // Explicit validation that always sets errors (used when clicking Next)
  const validateCurrentStepExplicitly = () => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 1: // Product selection
        if (formData.amount === '') {
          newErrors.amount = 'Сумма должна быть указана';
        } else if (typeof formData.amount === 'number' && formData.amount < 10000) {
          newErrors.amount = 'Сумма должна быть не менее 10 000 ₸';
        } else if (typeof formData.amount === 'number' && formData.amount > 3000000) {
          newErrors.amount = 'Сумма не должна превышать 3 000 000 ₸';
        }
        break;
        
      case 4: // OTP verification
        if (!formData.otp || formData.otp.length !== 6) {
          newErrors.otp = 'Введите 6-значный код из СМС';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate step 2 only when trying to proceed
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!validateIIN(formData.iin)) {
      newErrors.iin = 'ИИН должен содержать ровно 12 цифр';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Поле обязательно для заполнения';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Поле обязательно для заполнения';
    }
    
    // Validate phone number in international format for API requirements
    // We check both displayed format and what will be sent to API
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    const phoneForApi = formatPhoneForApi(formData.phone);
    const phoneApiRegex = /^\+7\d{10}$/;
    
    if (!formData.phone || !phoneRegex.test(formData.phone) || !phoneApiRegex.test(phoneForApi)) {
      newErrors.phone = 'Введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX';
    }
    
    if (formData.preferredPaymentDay < 1 || formData.preferredPaymentDay > 28) {
      newErrors.preferredPaymentDay = 'Выберите дату от 1 до 28';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Send OTP code for verification
  const sendOtpCode = async () => {
    try {
      console.log('Sending OTP for application ID:', params.applicationId);
      console.log('Request URL:', `/applications/${params.applicationId}/send-otp`);
      
      // Add more detailed logging
      try {
        const response = await axiosClient.post(`/applications/${params.applicationId}/send-otp`);
        console.log('OTP API response:', response);
        console.log('OTP code sent successfully');
        return true;
      } catch (apiError: any) {
        console.error('Detailed API error when sending OTP:', {
          message: apiError.message || 'Unknown error',
          status: apiError.status || 'Unknown status',
          data: apiError.data || 'No data'
        });
        throw apiError; // Re-throw to be caught by outer catch
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  };
  
  // Go to next step
  const handleNext = async () => {
    console.log('handleNext called, currentStep:', currentStep);
    setShowErrors(true);
    setError(null); // Clear any previous errors
    setUpdateSuccess(false); // Reset success state
    
    let currentStepValid = false;
    
    if (currentStep === 2) {
      // For step 2, validate explicitly when trying to proceed
      currentStepValid = validateStep2();
      if (!currentStepValid) return;
    } else {
      currentStepValid = validateCurrentStepExplicitly();
      if (!currentStepValid) return;
    }
    
    // Update application data in the backend
    try {
      setLoading(true);
      setIsUpdating(true); // Set step-specific loading state
      
      const updatePayload: UpdateApplicationPayload = {};
      
      // Add data to payload based on current step
      switch (currentStep) {
        case 1:
          // Explicitly set the type based on the loan type
          const type = formData.loanType === 'credit' ? 'LOAN' : 'INSTALLMENT';
          console.log('Setting loan type:', formData.loanType, 'Setting type:', type);
          
          updatePayload.loanType = formData.loanType;
          updatePayload.term = formData.term;
          updatePayload.amount = typeof formData.amount === 'string' 
            ? parseFormattedNumber(formData.amount) 
            : formData.amount;
          updatePayload.type = type;
          break;
          
        case 2:
          // Get current loan type from applicationData to determine redemption method
          const currentType = applicationData?.type || 
                             (formData.loanType === 'credit' ? 'LOAN' : 'INSTALLMENT');
          
          updatePayload.iin = formData.iin;
          updatePayload.lastName = formData.lastName;
          updatePayload.firstName = formData.firstName;
          updatePayload.middleName = formData.middleName || ''; // Ensure middle name is sent even if empty
          
          // Format phone to international format for API
          updatePayload.phone = formatPhoneForApi(formData.phone);
          
          // Use preferredPaymentDate instead of preferredPaymentDay for API compatibility
          updatePayload.preferredPaymentDate = formData.preferredPaymentDay;
          // Remove preferredPaymentDay to avoid confusion - API expects preferredPaymentDate
          delete updatePayload.preferredPaymentDay;
          
          // Add redemptionMethod which is required by the API - default to ANNUITET for all loan types
          updatePayload.redemptionMethod = "ANNUITET";
          
          // Include the type again to ensure consistency
          updatePayload.type = currentType;
          
          console.log('Sending personal data to API:', JSON.stringify(updatePayload));
          break;
          
        case 3:
          // Check bank statement only if document is uploaded and hasn't been checked yet
          if (formData.document && formData.iin && !statementCheckResult && !statementCheckError) {
            console.log('STEP 3 - Checking bank statement before sending OTP');
            try {
              setIsCheckingStatement(true);
              setStatementCheckError(null);
              setStatementCheckResult(null);
              
              console.log('Checking bank statement:', {
                type: formData.bankType,
                iin: formData.iin,
                fileName: formData.document.name
              });
              
              const checkResult = await bankStatementService.checkStatement(
                formData.bankType,
                formData.iin,
                formData.document,
                params.applicationId
              );
              
              console.log('Bank statement check result:', checkResult);
              console.log('Checking for errors in API response:', {
                hasData: !!checkResult.data,
                hasErrorCode: !!checkResult.data?.ErrorCode,
                errorCode: checkResult.data?.ErrorCode,
                hasErrorMessage: !!checkResult.data?.ErrorMessage,
                errorMessage: checkResult.data?.ErrorMessage,
                success: checkResult.success
              });
              
              // Check if there are errors in data first (business logic errors)
              if (checkResult.data?.ErrorCode || checkResult.data?.ErrorMessage) {
                const errorMessage = checkResult.data.ErrorMessage || 'Ошибка при проверке выписки';
                console.log('API returned business logic error:', checkResult.data.ErrorCode, errorMessage);
                throw new Error(errorMessage);
              }
              
              // Then check if the response indicates technical success
              if (!checkResult.success) {
                const errorMessage = checkResult.message || checkResult.error || 'Ошибка при проверке выписки';
                console.log('API returned success: false, treating as error:', errorMessage);
                throw new Error(errorMessage);
              }
              
              console.log('Bank statement check successful, setting result');
              setStatementCheckResult(checkResult);
              
              // Show success message briefly
              await new Promise(resolve => setTimeout(resolve, 1000));
              
            } catch (statementError: any) {
              console.error('Error checking bank statement:', statementError);
              console.log('Error details in handleNext:', {
                errorMessage: statementError.message,
                errorName: statementError.name,
                fullError: statementError
              });
              
              // Handle specific error types
              let errorMessage = '';
              console.log('Checking error message for date-related keywords in handleNext:', {
                message: statementError.message,
                includesДата: statementError.message?.includes('дата'),
                includesPeriod: statementError.message?.includes('period'),
                includesУстарела: statementError.message?.includes('устарела'),
                includesDate: statementError.message?.includes('date'),
                includesWrongDate: statementError.message?.includes('wrong date')
              });
              
              if (statementError.message && (statementError.message.includes('дата') || 
                  statementError.message.includes('period') ||
                  statementError.message.includes('устарела') ||
                  statementError.message.includes('date') ||
                  statementError.message.includes('wrong date'))) {
                errorMessage = getDateErrorMessage();
                console.log('Setting date-related error message in handleNext');
              } else {
                errorMessage = 'Не удалось обработать выписку. Не беспокойтесь, вы можете продолжить без неё — это не повлияет на рассмотрение заявки.';
                console.log('Setting generic error message in handleNext');
              }
              
              console.log('Final error message to display in handleNext:', errorMessage);
              setStatementCheckError(errorMessage);
              
              // Wait a moment to show error, then continue
              await new Promise(resolve => setTimeout(resolve, 2000));
            } finally {
              setIsCheckingStatement(false);
            }
          } else if (statementCheckResult) {
            console.log('STEP 3 - Bank statement already checked successfully');
          } else if (statementCheckError) {
            console.log('STEP 3 - Bank statement check failed, continuing anyway');
          }
          
          // Send OTP when moving from step 3 to step 4
          console.log('STEP 3 - Sending OTP after statement check');
          try {
            console.log('Sending OTP when moving from step 3 to step 4');
            const otpSent = await sendOtpCode();
            if (otpSent) {
              console.log('OTP sent successfully when moving to step 4');
            } else {
              console.error('Failed to send OTP when moving to step 4');
              throw new Error('Failed to send OTP');
            }
          } catch (otpError) {
            console.error('Error sending OTP:', otpError);
            setError('Не удалось отправить код подтверждения. Пожалуйста, попробуйте позже.');
            setIsUpdating(false);
            setLoading(false);
            return; // Stop execution if OTP sending fails
          }
          break;
          
        case 4:
          // OTP verification would normally update status
          break;
      }
      
      // Only update if we have data in the payload
      if (Object.keys(updatePayload).length > 0) {
        try {
          const updated = await applicationService.updateApplication(
            params.applicationId, 
            updatePayload
          );
          setApplicationData(updated);
          
          // If we're on step 2, show success message briefly before proceeding
          if (currentStep === 2) {
            setUpdateSuccess(true);
            console.log('Personal data successfully updated:', updated);
            
            // Wait a moment to show success message before moving to next step
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
        } catch (apiError: any) {
          console.error('API Error during update:', apiError);
          
          // Show specific error message based on the step
          if (currentStep === 2) {
            setError(`Не удалось сохранить личные данные: ${apiError.message || 'Проверьте введенные данные'}`);
            setIsUpdating(false);
            setLoading(false);
            return; // Stop execution to prevent proceeding to next step
          }
          
          throw apiError; // Re-throw the error to be caught by the outer catch block
        }
      }
      
      // Handle completion of step 4 (final step)
      if (currentStep === 4) {
        // Get final application status
        const finalData = await applicationService.getApplication(params.applicationId);
        setApplicationData(finalData);
        
        // Set status based on backend response
        if (finalData.status === 'BANK_APPROVED') {
          setApplicationStatus('approved');
        } else if (finalData.status === 'BANK_REJECTED') {
          setApplicationStatus('rejected');
        } else {
          setApplicationStatus('pending');
        }
        
        setCurrentStep(5);
      } else {
        // Move to next step for steps 1-3
        setCurrentStep(prev => prev + 1);
      }
      
      setShowErrors(false); // Reset errors for next step
      
    } catch (err) {
      console.error('Failed to update application data:', err);
      setError('Не удалось сохранить данные. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  };
  
  // Handle skip document upload
  const handleSkip = () => {
    if (currentStep === 3 && !formData.document) {
      setShowSkipModal(true);
    }
  };
  
  // Confirm skip and proceed
  const confirmSkip = async () => {
    setShowSkipModal(false);
    
    // We need to send OTP here too when skipping to step 4
    try {
      setLoading(true);
      console.log('Sending OTP from confirmSkip when skipping to step 4');
      const otpSent = await sendOtpCode();
      if (otpSent) {
        console.log('OTP sent successfully from confirmSkip');
      } else {
        console.error('Failed to send OTP from confirmSkip');
        setError('Не удалось отправить код подтверждения. Пожалуйста, попробуйте позже.');
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error('Error in OTP sending from confirmSkip:', err);
      setError('Не удалось отправить код подтверждения. Пожалуйста, попробуйте позже.');
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
    
    setCurrentStep(prev => prev + 1);
    setShowErrors(false);
  };
  
  // Close modal and continue with document upload
  const cancelSkip = () => {
    setShowSkipModal(false);
  };
  
  // Go to previous step
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderProductSelectionStep();
      case 2:
        return renderClientDataStep();
      case 3:
        return renderDocumentUploadStep();
      case 4:
        return renderOtpVerificationStep();
      case 5:
        return renderApplicationStatusStep();
      default:
        return null;
    }
  };
  
  // Step 1: Product Selection
  const renderProductSelectionStep = () => (
    <div className="bg-white p-8 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-800 mb-8">Выберите условия финансирования</h2>
      
      <div className="space-y-8">
        {/* Loan Type Selection */}
        <div>
          <h3 className="text-base text-slate-800 font-medium mb-4">Тип финансирования</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => handleChange('loanType', 'installment')}
              className={`cursor-pointer transition-all px-6 py-4 rounded-2xl text-center relative ${
                formData.loanType === 'installment'
                  ? 'bg-white border-2 border-sky-500 shadow-md' 
                  : 'bg-slate-50 border border-slate-100 hover:bg-slate-100'
              }`}
            >
              {formData.loanType === 'installment' && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="font-medium text-slate-800 text-lg">Рассрочка</div>
              <p className="text-sm text-slate-500 mt-1">Без переплаты, равными платежами</p>
            </div>
            
            <div
              onClick={() => handleChange('loanType', 'credit')}
              className={`cursor-pointer transition-all px-6 py-4 rounded-2xl text-center relative ${
                formData.loanType === 'credit'
                  ? 'bg-white border-2 border-sky-500 shadow-md' 
                  : 'bg-slate-50 border border-slate-100 hover:bg-slate-100'
              }`}
            >
              {formData.loanType === 'credit' && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="font-medium text-slate-800 text-lg">Кредит</div>
              <p className="text-sm text-slate-500 mt-1">С процентной ставкой на длительный срок</p>
            </div>
          </div>
        </div>

        {/* Term Selection */}
        <div>
          <h3 className="text-base text-slate-800 font-medium mb-4">Срок</h3>
          
          <div className="grid grid-cols-4 gap-3">
            {formData.loanType === 'credit' ? (
              <>
                {[6, 12, 24, 36].map((months) => (
                  <div
                    key={months}
                    onClick={() => handleChange('term', months)}
                    className={`text-center py-4 cursor-pointer rounded-xl transition-all ${
                      formData.term === months 
                        ? 'bg-sky-50 ring-1 ring-sky-200' 
                        : 'bg-white border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xl font-medium text-slate-800">
                      {months}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[3, 6, 12, 24].map((months) => (
                  <div
                    key={months}
                    onClick={() => handleChange('term', months)}
                    className={`text-center py-4 cursor-pointer rounded-xl transition-all ${
                      formData.term === months 
                        ? 'bg-sky-50 ring-1 ring-sky-200' 
                        : 'bg-white border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xl font-medium text-slate-800">
                      {months}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base text-slate-800 font-medium">Сумма финансирования</h3>
            <span className="text-xl font-medium text-sky-600">
              {formData.amount ? `₸ ${formatNumberWithSpaces(formData.amount)}` : ''}
            </span>
          </div>
          
          <div className="mb-6">
            <input
              type="range"
              id="amount-slider"
              min={10000}
              max={3000000}
              step={10000}
              value={formData.amount || 10000}
              onChange={(e) => handleChange('amount', Number(e.target.value))}
              className="w-full h-2 appearance-none bg-slate-200 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-600"
            />
            
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>10 000 ₸</span>
              <span>3 000 000 ₸</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-slate-500 sm:text-sm">₸</span>
            </div>
            <input
              type="text"
              id="amount"
              value={formData.amount ? formatNumberWithSpaces(formData.amount) : ''}
              onChange={(e) => {
                const val = e.target.value.replace(/\s+/g, '');
                if (val === '') {
                  handleChange('amount', '');
                } else if (/^\d+$/.test(val)) {
                  handleChange('amount', Number(val));
                }
              }}
              className={`block w-full pl-8 pr-4 py-3 bg-white border rounded-xl text-slate-900 ${
                showErrors && errors.amount 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-slate-200 focus:border-sky-600 focus:ring-1 focus:ring-sky-600'
              }`}
              placeholder="Введите сумму"
              style={{ appearance: 'textfield' }}
            />
          </div>
          
          {showErrors && errors.amount && (
            <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>
      </div>
    </div>
  );
  
  // Step 2: Client Data
  const renderClientDataStep = () => (
    <div className="bg-white p-8 rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Данные клиента</h2>
      
      {/* Success message */}
      {updateSuccess && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100 flex items-start">
          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
          <p className="text-green-800">Данные успешно сохранены</p>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100 flex items-start">
          <XCircleIcon className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      <div className="space-y-5">
        {/* IIN */}
        <div>
          <label htmlFor="iin" className="block text-sm font-medium text-slate-700 mb-2">ИИН</label>
          <input
            type="text"
            id="iin"
            maxLength={12}
            value={formData.iin}
            onChange={(e) => handleChange('iin', e.target.value.replace(/[^0-9]/g, ''))}
            className={`mt-1 block w-full rounded-xl shadow-sm bg-slate-50 border-none py-3 px-4 text-slate-900 ${
              showErrors && errors.iin 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'focus:border-sky-600 focus:ring-1 focus:ring-sky-600'
            }`}
            placeholder="Введите ИИН"
          />
          {showErrors && errors.iin && <p className="mt-2 text-sm text-red-600">{errors.iin}</p>}
        </div>
        
        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">Фамилия</label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className={`mt-1 block w-full rounded-xl shadow-sm bg-slate-50 border-none py-3 px-4 text-slate-900 ${
              showErrors && errors.lastName 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'focus:border-sky-600 focus:ring-1 focus:ring-sky-600'
            }`}
            placeholder="Введите фамилию"
          />
          {showErrors && errors.lastName && <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>}
        </div>
        
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">Имя</label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className={`mt-1 block w-full rounded-xl shadow-sm bg-slate-50 border-none py-3 px-4 text-slate-900 ${
              showErrors && errors.firstName 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'focus:border-sky-600 focus:ring-1 focus:ring-sky-600'
            }`}
            placeholder="Введите имя"
          />
          {showErrors && errors.firstName && <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>}
        </div>
        
        {/* Middle Name */}
        <div>
          <label htmlFor="middleName" className="block text-sm font-medium text-slate-700 mb-2">Отчество</label>
          <input
            type="text"
            id="middleName"
            value={formData.middleName}
            onChange={(e) => handleChange('middleName', e.target.value)}
            className="mt-1 block w-full rounded-xl shadow-sm bg-slate-50 border-none py-3 px-4 text-slate-900 focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
            placeholder="Введите отчество"
          />
        </div>
        
        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Номер телефона</label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            className={`mt-1 block w-full rounded-xl shadow-sm bg-slate-50 border-none py-3 px-4 text-slate-900 ${
              showErrors && errors.phone 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'focus:border-sky-600 focus:ring-1 focus:ring-sky-600'
            }`}
            placeholder="+7"
          />
          {showErrors && errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
        </div>
        
        {/* Preferred Payment Day */}
        <div>
          <label htmlFor="preferredPaymentDay" className="block text-sm font-medium text-slate-700 mb-2">
            Предпочтительный день платежа
          </label>
          <select
            id="preferredPaymentDay"
            value={formData.preferredPaymentDay}
            onChange={(e) => handleChange('preferredPaymentDay', Number(e.target.value))}
            className={`mt-1 block w-full rounded-xl shadow-sm bg-slate-50 border-none py-3 px-4 text-slate-900 ${
              showErrors && errors.preferredPaymentDay 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'focus:border-sky-600 focus:ring-1 focus:ring-sky-600'
            }`}
          >
            {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          {showErrors && errors.preferredPaymentDay && (
            <p className="mt-2 text-sm text-red-600">{errors.preferredPaymentDay}</p>
          )}
        </div>
        
        {/* Add loading overlay when updating */}
        {(isUpdating || isCheckingStatement) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-sm w-full text-center">
              <div className="w-12 h-12 mb-4 mx-auto border-4 border-t-sky-600 border-sky-100 rounded-full animate-spin"></div>
              <p className="text-slate-700 font-medium">
                {isCheckingStatement 
                  ? 'Проверяем выписку банка...' 
                  : currentStep === 3 
                    ? 'Отправляем код подтверждения...'
                    : 'Сохранение данных...'
                }
              </p>
              {isCheckingStatement && (
                <p className="text-xs text-slate-500 mt-2">Анализируем ваши финансовые данные</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  // Step 3: Document Upload
  const renderDocumentUploadStep = () => (
    <div className="p-6 bg-white rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold text-slate-800 mb-3">Загрузка выписки из банка</h2>
      
      <p className="text-sm text-slate-600 mb-6">
        Прикрепите выписку из вашего банка, чтобы увеличить шансы на одобрение <span className="text-sky-600 font-medium">в 2 раза</span>.
      </p>
      
      <div className="space-y-6">
        {/* Bank Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Выберите банк</label>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => handleChange('bankType', 'kaspi')}
              className={`cursor-pointer transition-all px-6 py-4 rounded-2xl text-center relative ${
                formData.bankType === 'kaspi'
                  ? 'bg-white border-2 border-sky-500 shadow-md' 
                  : 'bg-slate-50 border border-slate-100 hover:bg-slate-100'
              }`}
            >
              {formData.bankType === 'kaspi' && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="font-medium text-slate-800 text-lg">Kaspi Bank</div>
            </div>
            
            <div
              onClick={() => handleChange('bankType', 'halyk')}
              className={`cursor-pointer transition-all px-6 py-4 rounded-2xl text-center relative ${
                formData.bankType === 'halyk'
                  ? 'bg-white border-2 border-sky-500 shadow-md' 
                  : 'bg-slate-50 border border-slate-100 hover:bg-slate-100'
              }`}
            >
              {formData.bankType === 'halyk' && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="font-medium text-slate-800 text-lg">Halyk Bank</div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-start mb-4">
            <div className="flex-1">
              <button 
                type="button" 
                onClick={() => setShowInstructionsModal(true)}
                className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                {formData.bankType === 'halyk' ? 'Как скачать выписку Halyk?' : 'Как скачать выписку Kaspi?'}
              </button>
            </div>
          </div>
          
          {!formData.document ? (
            <div className="w-full">
              <label htmlFor="fileUpload" className="cursor-pointer block w-full">
                <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <DocumentArrowUpIcon className="w-10 h-10 text-slate-400 mb-3" />
                  <p className="text-slate-500 font-medium">Нажмите для загрузки файла</p>
                  <p className="text-sm text-slate-400 mt-1">Только PDF до 10 МБ</p>
                </div>
                <input
                  id="fileUpload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl w-full">
              <div className="flex items-center">
                <DocumentArrowUpIcon className="w-6 h-6 text-slate-600 mr-3" />
                <span className="font-medium text-slate-800">{documentName}</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="flex items-center px-3 py-1.5 bg-white rounded-lg text-red-600 hover:text-red-700 border border-slate-200"
              >
                <TrashIcon className="w-4 h-4 mr-1.5" />
                Удалить
              </button>
            </div>
          )}
          
          {errors.document && <p className="mt-2 text-sm text-red-600">{errors.document}</p>}
        </div>
        
        {/* Bank statement check status indicators */}
        {(isCheckingStatement || statementCheckResult || statementCheckError || (formData.document && !formData.iin)) && (
          <div className="mt-6 p-4 rounded-lg border">
            {isCheckingStatement && (
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-t-sky-600 border-sky-100 rounded-full animate-spin"></div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Проверяем выписку банка...</p>
                  <p className="text-xs text-slate-500">Анализируем ваши финансовые данные для улучшения условий</p>
                </div>
              </div>
            )}
            
            {statementCheckResult && !isCheckingStatement && (
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-700">✅ Выписка успешно обработана!</p>
                  <p className="text-xs text-green-600 mt-1">
                    Отлично! Ваши финансовые данные повышают шансы на одобрение заявки
                  </p>
                  {statementCheckResult.data?.scoreRb && (
                    <div className="mt-2 text-xs text-slate-600 bg-green-50 px-2 py-1 rounded">
                      <span className="font-medium">Статус:</span> {statementCheckResult.data.scoreRb.status}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {statementCheckError && !isCheckingStatement && (
              <div className="flex items-start space-x-3">
                <XCircleIcon className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-700">
                    {statementCheckError.includes('дата') || statementCheckError.includes('устарела') ||
                     statementCheckError.includes('date') || statementCheckError.includes('wrong date')
                      ? 'Данные в выписке устарели' 
                      : '⚠️ Выписка не обработана'
                    }
                  </p>
                  <div className="mt-1">
                    {(statementCheckError.includes('дата') || statementCheckError.includes('устарела') || 
                      statementCheckError.includes('date') || statementCheckError.includes('wrong date')) ? (
                      <>
                        <p className="text-xs text-amber-600">
                          Пожалуйста, загрузите актуальную выписку с данными по {new Date().toLocaleDateString('ru-RU', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                          })}.
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          Вы можете продолжить оформление заявки без добавления выписки.
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-amber-600">{statementCheckError}</p>
                    )}
                  </div>
                  {(statementCheckError.includes('дата') || statementCheckError.includes('устарела') || 
                    statementCheckError.includes('date') || statementCheckError.includes('wrong date')) && (
                    <button
                      type="button"
                      onClick={() => {
                        const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
                        if (fileInput) {
                          setStatementCheckError(null);
                          setStatementCheckResult(null);
                          fileInput.click();
                        }
                      }}
                      className="mt-2 text-xs text-sky-600 hover:text-sky-700 font-medium underline"
                    >
                      Загрузить новую выписку
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {formData.document && !formData.iin && !isCheckingStatement && !statementCheckResult && !statementCheckError && (
              <div className="flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-700">📄 Выписка загружена</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Проверка и анализ выписки будут выполнены автоматически на следующем шаге
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
  
  // Step 4: OTP Verification
  const renderOtpVerificationStep = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-700 transition-colors focus:outline-none rounded-full hover:bg-slate-100"
              aria-label="Назад"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-slate-500">ID: {applicationData?.shortId || params.applicationId}</span>
          </div>
          
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Подтверждение заявки</h2>
            
            <p className="text-slate-600 mb-8">
              Введите код для подтверждения заявки.
            </p>
            
            <div className="mb-8">
              <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-3">Код из СМС</label>
              <div className={`mb-2 ${otpError ? 'shake-animation' : ''}`}>
                <input
                  type="text"
                  id="otp"
                  value={formData.otp}
                  onChange={(e) => handleOtpChange(e.target.value)}
                  maxLength={6}
                  className={`block w-full text-center text-3xl tracking-[0.75em] py-5 rounded-lg font-bold ${
                    otpError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50 text-red-500' 
                      : 'border-2 border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-slate-700 shadow-sm'
                  }`}
                  placeholder="000000"
                  autoComplete="off"
                  style={{
                    letterSpacing: '0.75em',
                    paddingLeft: '0.75em',
                    background: 'linear-gradient(to right, #fff, #fafafa)',
                    boxShadow: otpError ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
                    caretColor: 'transparent'
                  }}
                />
              </div>
              {otpError && (
                <div className="flex items-center text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm">{otpError}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center">
              <button
                type="button"
                className={`text-sm px-4 py-2 rounded-lg transition-all ${
                  resendTimer > 0 
                    ? 'text-slate-400 cursor-not-allowed' 
                    : 'text-sky-600 hover:text-white hover:bg-sky-600'
                }`}
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
              >
                {resendTimer > 0 
                  ? `Отправить код повторно (${resendTimer} сек.)` 
                  : 'Отправить код повторно'}
              </button>
            </div>
          </div>
        </div>

        {/* Hidden buttons for functionality, not visible to user */}
        <div className="hidden">
          <button
            type="button"
            id="confirm-button"
            onClick={handleNext}
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
  
  // Step 5: Application Status
  const renderApplicationStatusStep = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="w-full max-w-2xl px-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center">
              <Image 
                src="/pluse-logo.png" 
                alt="Pluse" 
                width={100} 
                height={28} 
                className="w-auto h-6" 
              />
            </div>
          </div>
          
          <div className="p-8">
            {applicationStatus === 'approved' && (
              <div className="space-y-8">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-6 rounded-full flex items-center justify-center bg-emerald-500">
                    <CheckCircleIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Поздравляем! Заявка одобрена</h3>
                  <div className="flex items-center justify-center mt-2 mb-4">
                    <Image 
                      src="/rbk-logo.png" 
                      alt="RBK Bank" 
                      width={140} 
                      height={42} 
                      className="h-auto w-auto" 
                    />
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Номер заявки</p>
                      <p className="text-lg font-semibold text-slate-800">{applicationData?.shortId || ''}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Тип финансирования</p>
                      <p className="text-lg font-semibold text-slate-800">
                        {applicationData?.type === 'LOAN' || formData.loanType === 'credit' ? 'Кредит' : 'Рассрочка'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Одобренная сумма</p>
                      <p className="text-lg font-semibold text-sky-600">{formatCurrency(applicationData?.amount || formData.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Срок</p>
                      <p className="text-lg font-semibold text-slate-800">{applicationData?.term || formData.term} мес.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-sky-50 border-l-4 border-sky-400 p-4 rounded mb-6">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-slate-700">
                      Перейдите по ссылке и следуйте инструкциям, чтобы подписать договор с банком.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center space-y-4 flex-col items-center">
                  <a
                    href="https://tulpar.bankrbk.kz/authorize"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 text-white font-medium rounded-lg hover:bg-sky-700 transition-all bg-sky-600 mb-4 w-full text-center"
                  >
                    Подписать договор
                  </a>
                </div>
              </div>
            )}
            
            {applicationStatus === 'pending' && (
              <div className="space-y-8">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-6 rounded-full flex items-center justify-center bg-sky-500">
                    <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Заявка в обработке</h3>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Номер заявки</p>
                      <p className="text-lg font-semibold text-slate-800">{applicationData?.shortId || ''}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Тип финансирования</p>
                      <p className="text-lg font-semibold text-slate-800">
                        {applicationData?.type === 'LOAN' || formData.loanType === 'credit' ? 'Кредит' : 'Рассрочка'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Запрашиваемая сумма</p>
                      <p className="text-lg font-semibold text-slate-800">{formatCurrency(applicationData?.amount || formData.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Срок</p>
                      <p className="text-lg font-semibold text-slate-800">{applicationData?.term || formData.term} мес.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-sky-50 border-l-4 border-sky-400 p-4 rounded mb-6">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-slate-700">
                      Ваша заявка обрабатывается. Результат будет известен в течение нескольких минут. Пожалуйста, ожидайте.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="inline-flex h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full animate-progress bg-sky-600"></div>
                  </div>
                </div>
              </div>
            )}
            
            {applicationStatus === 'rejected' && (
              <div className="space-y-8">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-6 rounded-full flex items-center justify-center bg-red-500">
                    <XCircleIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Заявка не одобрена</h3>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Номер заявки</p>
                      <p className="text-lg font-semibold text-slate-800">{applicationData?.shortId || ''}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Тип финансирования</p>
                      <p className="text-lg font-semibold text-slate-800">
                        {applicationData?.type === 'LOAN' || formData.loanType === 'credit' ? 'Кредит' : 'Рассрочка'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Запрашиваемая сумма</p>
                      <p className="text-lg font-semibold text-slate-800">{formatCurrency(applicationData?.amount || formData.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Срок</p>
                      <p className="text-lg font-semibold text-slate-800">{applicationData?.term || formData.term} мес.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-6">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-slate-700">
                      К сожалению, в данный момент мы не можем одобрить вашу заявку. Вы можете повторить попытку через 30 дней или выбрать другие условия финансирования.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => window.location.href = `/public/${params.slug}`}
                    className="px-6 py-3 text-white font-medium rounded-lg hover:bg-sky-700 transition-all bg-sky-600"
                  >
                    Вернуться на главную
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  // Main render
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center border border-gray-200">
          <div className="w-16 h-16 mb-6 rounded-full bg-[#f7faff] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-t-sky-600 border-sky-100 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Обработка заявки...</h2>
          <p className="text-gray-600">
            Пожалуйста, подождите, мы обрабатываем вашу заявку.
          </p>
        </div>
      </div>
    );
  }

  // For step 4, use a different layout
  if (currentStep === 4) {
    return renderOtpVerificationStep();
  }
  
  // For step 5, use a different layout
  if (currentStep === 5) {
    return renderApplicationStatusStep();
  }

    return (
    <div className="min-h-screen bg-white">
      {/* Add custom animation styles */}
      <style dangerouslySetInnerHTML={{ __html: progressAnimation + `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake-animation {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}} />
      
      {/* Skip confirmation modal */}
      {showSkipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Повысьте шансы на одобрение</h3>
            <p className="text-slate-600 mb-3">
              Клиенты с загруженной банковской выпиской получают одобрение в <span className="font-semibold text-sky-600">2 раза чаще</span>.
            </p>
            <p className="text-slate-600 mb-6">
              Загрузка выписки займет меньше минуты.
            </p>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-end">
              <button
                type="button"
                onClick={cancelSkip}
                className="px-4 py-2 bg-sky-600 rounded-lg text-white hover:bg-sky-700 transition-colors"
              >
                Вернуться к загрузке
              </button>
          <button
                type="button"
                onClick={confirmSkip}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
                Пропустить
          </button>
        </div>
      </div>
        </div>
      )}
      
      {/* Instructions modal */}
      {showInstructionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-semibold text-slate-800">
                  {formData.bankType === 'halyk' ? 'Как скачать выписку из Halyk Bank' : 'Как скачать выписку из Kaspi Bank'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInstructionsModal(false)}
                className="text-slate-400 hover:text-slate-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-5">
              {formData.bankType === 'kaspi' ? (
                <>
                  <p className="text-slate-600">
                    Чтобы получить выписку из Kaspi Bank, следуйте этим шагам:
                  </p>
                  
                  <ol className="list-decimal list-inside space-y-3 ml-1 text-slate-600">
                    <li className="pl-1">
                      <span className="font-medium text-slate-700">Откройте приложение Kaspi.kz</span> на вашем смартфоне.
                    </li>
                    <li className="pl-1">
                      <span className="font-medium text-slate-700">Перейдите в Kaspi Gold</span> или выберите нужную карту, с которой хотите получить выписку.
                    </li>
                    <li className="pl-1">
                      <span className="font-medium text-slate-700">Нажмите «Инфо»</span> в нижней части экрана приложения.
                    </li>
                    <li className="pl-1">
                      <span className="font-medium text-slate-700">Выберите раздел «Справки»</span> из открывшегося меню.
                    </li>
                    <li className="pl-1">
                      <span className="font-medium text-slate-700">Нажмите «Справка о доступном остатке с выпиской за 12 месяцев»</span> из списка доступных справок.
                    </li>
                    <li className="pl-1">
                      <span className="font-medium text-slate-700">Скачайте PDF-документ</span> на ваше устройство для последующей загрузки.
                    </li>
                  </ol>
                </>
              ) : (
                <>
                  <p className="text-slate-600">
                    Чтобы получить выписку из Halyk Bank, следуйте этим шагам:
                  </p>
                  
                  <ol className="list-decimal list-inside space-y-3 ml-1 text-slate-600">
                    <li className="pl-1">
                      <span className="font-medium text-slate-700">Зайдите в приложение Halyk Bank</span> на вашем смартфоне.
                    </li>
                    <li className="pl-1">
                      <span className="font-medium text-slate-700">Перейдите в раздел «Счета»</span> в главном меню.
                    </li>
                    <li className="pl-1">
                      <span className="font-medium text-slate-700">Выберите «Выписка»</span> в открывшемся меню.
                    </li>
                    <li className="pl-1">
                      <span className="font-medium text-slate-700">Перейдите в «Операции»</span>.
                    </li>
                    <li className="pl-1">
                      <span className="font-medium text-slate-700">Выберите период – 183 дня</span> в настройках выписки.
                    </li>
                    <li className="pl-1">
                      <span className="font-medium text-slate-700">Нажмите «Разбить по счетам (IBAN)»</span>.
                    </li>
                    <li className="pl-1">
                      <span className="font-medium text-slate-700">Нажмите на значок скачивания</span> и выберите PDF-версию документа.
                    </li>
                  </ol>
                </>
              )}
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Важно:</span> Убедитесь, что выписка содержит информацию по сегодняшнюю дату. Это увеличит шансы на быстрое одобрение заявки.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowInstructionsModal(false)}
                className="px-4 py-2 bg-sky-600 rounded-lg text-white hover:bg-sky-700 transition-colors"
              >
                Понятно
              </button>
            </div>
          </div>
        </div>
      )}
      
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Image 
              src="/pluse-logo.png" 
              alt="Pluse" 
              width={100} 
                height={28} 
                className="w-auto h-6" 
            />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6 sm:p-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden p-6 sm:p-8">
          {currentStep < 5 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
              <div>
                  <span className="text-sm font-medium text-sky-600">
                    ШАГ {currentStep} ИЗ 4
                  </span>
              </div>
              <div>
                  <span className="text-sm font-medium text-slate-500">
                    ID: {applicationData?.shortId || params.applicationId}
                  </span>
                </div>
              </div>
              
              <div className="w-full h-2 bg-[#EEF1F6] rounded-full mt-3 flex overflow-hidden">
                <div 
                  className="h-full bg-sky-600 transition-all duration-500 ease-in-out"
                  style={{ width: `${Math.min(100, currentStep * 25)}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {renderStepContent()}
          
          {/* Navigation buttons */}
          {currentStep < 5 && currentStep !== 4 && (
            <div className={`mt-8 ${currentStep === 1 ? 'flex justify-end' : 'flex justify-between'}`}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center px-5 py-2.5 bg-white border border-[#D0D5DD] rounded-lg font-medium text-[#344054] hover:bg-[#F9FAFB] transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5 mr-1" />
                  Назад
                </button>
              )}
              
              {currentStep < 5 && (
                <>
                  {currentStep === 3 && !formData.document ? (
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="px-5 py-2.5 rounded-lg font-medium text-slate-600 transition-all border border-slate-300 bg-slate-100 hover:bg-slate-200"
                    >
                      Пропустить
                    </button>
                  ) : (
              <button
                type="button"
                      onClick={handleNext}
                      className="px-5 py-2.5 rounded-lg font-medium text-white transition-all bg-sky-600 hover:bg-sky-700"
              >
                      Далее
              </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 