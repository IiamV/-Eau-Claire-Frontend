export interface RequestOtpRequest {
  method: 'email' | 'sms' | '';
  userId: number;
  deviceId: string;
  phone: string;
  email: string;
}

export interface RequestOtpSuccessResponse {
  isSuccess: boolean;
  errorCode: string;
  message: string;
}

export interface RequestOtpErrorResponse {
  message: string;
}

export interface VerifyOtpRequest {
  method: 'email' | 'sms' | '';
  userId: number;
  deviceId: string;
  phone: string;
  email: string;
  inputOtp: string;
  purpose: 'login' | 'register' | 'generic';
}

export interface VerifyOtpSuccessResponse {
  tempToken: string;
}

export interface VerifyOtpErrorResponse {
  message: string;
}
