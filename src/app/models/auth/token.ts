export interface ExchangeTempTokenRequest {
  tempToken: string;
}

export interface ExchangeTempTokenSuccessResponse {
  status: string;
  message: string;
}

export interface ExchangeTempTokenErrorResponse {
  message: string;
  isDeviceVerified?: boolean;
}

export interface ExchangeAuthTokenRequest {
  tempToken: string;
}

export interface ExchangeAuthTokenSuccessResponse {
  status: number;
  accessToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  refreshToken: string;
  tokenType: `Bearer ${string}`;
  scope: string;
  userId: number;
  isDeviceVerified: boolean;
  userProfile: {
    FullName: string;
    ContactAddress: string;
    PermanentAddress: string;
    CurrentPhoneNumber: string;
    DateOfBirth: string;
  };
}

export interface ExchangeAuthTokenErrorResponse {
  message: string;
  isDeviceVerified?: boolean;
}
