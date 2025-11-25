import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { verifyOtpRequest, requestOtpRequest, verifyOtpSuccessResponse, requestOtpSuccessResponse, requestOtpErrorResponse, verifyOtpErrorResponse } from "../../models/auth/otp";
import { catchError, Observable, throwError, tap, map } from "rxjs";
import { loginErrorResponse, loginRequest, loginSuccessResponse } from "../../models/auth/login";
import { environment } from "../../../environments/environment.dev";
import { resetPasswordErrorResponse, resetPasswordRequest, resetPasswordSuccessResponse } from "../../models/auth/reset-password";
import { exchangeAuthTokenErrorResponse, exchangeAuthTokenRequest, exchangeAuthTokenSuccessResponse, exchangeTempTokenRequest, exchangeTempTokenSuccessResponse } from "../../models/auth/token";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    // Base URL for all authentication-related API calls
    readonly baseUrl = environment.apiUrl;
    readonly verifyUrl = `${this.baseUrl}/sys/verify-otp`;
    readonly requestUrl = `${this.baseUrl}/sys/request-otp`;
    readonly tokenUrl = `${this.baseUrl}/sys/token`;
    readonly authTokenUrl = `${this.baseUrl}/sys/auth/token`;
    readonly loginUrl = `${this.baseUrl}/sys/login`;
    readonly resetPasswordUrl = `${this.baseUrl}/sys/reset-password`;

    /**
     * Constructor for AuthService
     * @param http Angular HttpClient for performing HTTP requests
     */
    constructor(private http: HttpClient) { }

    /**
     * Sends a request to generate and send an OTP to the user.
     * @param payload - The OTP payload containing the user's email or phone number.
     * @returns Observable<any> - Emits the API response on success or an error on failure.
     */
    requestOtp(payload: requestOtpRequest): Observable<any> {
        console.log("Request Payload:", payload);
        // return of(true);
        return this.http.post<requestOtpSuccessResponse>(this.requestUrl, payload).pipe(
            catchError((error: requestOtpErrorResponse) => {
                console.error('Request OTP failed:', error.message);
                return throwError(() => error);
            })
        );
    };

    /**
     * Verifies the OTP entered by the user.
     * @param payload - OTP payload containing the code and contact info.
     * @returns Observable<any> - Emits API verification result or an error.
     */
    verifyOtp(payload: verifyOtpRequest): Observable<any> {
        console.log("Verify Payload:", payload);
        // return of(true);
        return this.http.post<verifyOtpSuccessResponse>(this.verifyUrl, payload).pipe(
            tap((response) => {
                localStorage.setItem('temp_token', response.tempToken);
            }),
            catchError((error: verifyOtpErrorResponse) => {
                console.error('Details:', error.message);
                return throwError(() => error);
            })
        );
    };

    /**
     * Performs login using username and password credentials.
     * @param payload - Login credentials object.
     * @returns Observable<any> - Emits login response or throws an error.
     */
    login(payload: loginRequest): Observable<any> {
        console.log("Login Payload:", payload);
        // return of(true);
        // return throwError(() => new HttpErrorResponse({
        //     error: {
        //         message: "Device is not verified",
        //         isDeviceVerified: false
        //     },
        //     status: 401,
        //     statusText: "Unauthorized"
        // }));
        return this.http.post<loginSuccessResponse>(this.loginUrl, payload).pipe(
            tap((response) => {
                console.log('Login success');
                localStorage.setItem('access_token', response.access_token);
            }),
            map((response) => {
                // Return only the necessary data from the response
                let { access_token, ...data } = response;
                return data;
            }),
            catchError((error: loginErrorResponse) => {
                console.error("Details:", error.message);
                return throwError(() => error);
            })
        );
    };

    resetPassword(payload: resetPasswordRequest): Observable<any> {
        // console.log("Reset Payload:", payload);
        // return of(true);
        return this.http.post<resetPasswordSuccessResponse>(this.resetPasswordUrl, payload).pipe(
            catchError((error: resetPasswordErrorResponse) => {
                console.error("Details:", error.message);
                return throwError(() => error);
            })
        )
    }

    exchangeToken(payload: exchangeTempTokenRequest): Observable<any> {
        console.log("Token Payload:", payload);
        // return of(true);
        return this.http.post<exchangeTempTokenSuccessResponse>(this.tokenUrl, payload).pipe(
            tap((response) => {
                console.log('Exchange token success');
                // localStorage.setItem('temp_token', payload.tempToken);
            }),
            catchError((error) => {
                console.error("Details:", error.message);
                return throwError(() => error);
            })
        )
    }

    exchangeAuthToken(payload: exchangeAuthTokenRequest): Observable<any> {
        // console.log("Token Payload:", payload);
        // return of(true);
        return this.http.post<exchangeAuthTokenSuccessResponse>(this.authTokenUrl, payload).pipe(
            tap((response) => {
                console.log('Exchange token success');
                localStorage.setItem('access_token', response.accessToken);
            }),
            catchError((error: exchangeAuthTokenErrorResponse) => {
                console.error("Details:", error.message);
                return throwError(() => error);
            })
        )
    }
}