export interface exchangeTokenRequest {
    purpose: 'login' | 'register' | 'generic',
    tempToken: string
}

export interface exchangeTokenResponse {
    status: string,
    accessToken: string,
    expiresIn: number,
    refreshExpiresIn: number,
    refreshToken: string,
    tokenType: string,
    scope: string,
    userId: number,
    isDeviceVerified: boolean,
    userProfile: {
        FullName: string,
        ContactAddress: string,
        PermanentAddress: string,
        CurrentPhoneNumber: string,
        DateOfBirth: string
    }
}