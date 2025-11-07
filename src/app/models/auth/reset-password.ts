export interface resetPasswordRequest {
    userId: string,
    newPassword: string,
    confirmPassword: string,
    tempToken: string,
}

export interface resetPasswordSuccessResponse {
    message: string
}

export interface resetPasswordErrorResponse {
    message: string
}