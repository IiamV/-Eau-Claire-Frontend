export interface otp {
    method: 'email' | 'phone' | null;
    userId: number;
    deviceId: string;
    phone: string;
    email: string;
    inputOtp: string;
}