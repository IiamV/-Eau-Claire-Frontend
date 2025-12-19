export interface ResetPasswordRequest {
  userId: string;
  newPassword: string;
  confirmPassword: string;
  tempToken: string;
}

export interface ResetPasswordSuccessResponse {
  message: string;
}

export interface ResetPasswordErrorResponse {
  message: string;
}
