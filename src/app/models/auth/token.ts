export interface exchangeTempTokenRequest {
    tempToken: string
}

export interface exchangeTempTokenSuccessResponse {
    status: string,
    message: string
}

export interface exchangeTempTokenErrorResponse {
    message: string,
    isDeviceVerified?: boolean
}

export interface exchangeAuthTokenRequest {
    tempToken: string
}

export interface exchangeAuthTokenSuccessResponse {
    status: number,
    accessToken: string,
    expiresIn: number,
    refreshExpiresIn: number,
    refreshToken: string,
    tokenType: `Bearer ${string}`,
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

export interface exchangeAuthTokenErrorResponse {
    message: string,
    isDeviceVerified?: boolean
}