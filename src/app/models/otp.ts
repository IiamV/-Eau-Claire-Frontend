export interface otp {
    method: 'email' | 'sms' | null;
    userId: number;
    deviceId: string;
    phone: string;
    email: string;
    inputOtp: string;
}