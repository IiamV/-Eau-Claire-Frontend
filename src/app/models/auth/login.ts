export interface loginRequest {
    username: string,
    password: string,
    deivceId: string
};

export interface loginSuccessResponse {
    status: string,
    access_token: string,
    expires_in: number,
    refreshExpiresIn: number,
    refresh_token: string,
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
};

export interface loginErrorResponse {
    message: string,
    isDeviceVerified?: boolean
};