export interface requestOtpRequest {
    method: 'email' | 'sms' | '',
    userId: number,
    deviceId: string,
    phone: string,
    email: string
}

export interface requestOtpSuccessResponse {
    isSuccess: boolean,
    errorCode: string,
    message: string
}

export interface requestOtpErrorResponse {
    message: string
}

export interface verifyOtpRequest {
    method: 'email' | 'sms' | '',
    userId: number,
    deviceId: string,
    phone: string,
    email: string,
    inputOtp: string,
    purpose: string
}

export interface verifyOtpSuccessResponse {
    tempToken: string
}

export interface verifyOtpErrorResponse {
    message: string
}