export interface resetPasswordRequest {
    userId: string,
    newPassword: string,
    confirmPassword: string,
    tempToken: string,
}

export interface resetPasswordResponse {
    message: string
}