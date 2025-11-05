import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { verifyOtpRequest, requestOtpRequest } from "../../models/auth/otp";
import { catchError, Observable, throwError, tap, map, of } from "rxjs";
import { loginRequest } from "../../models/auth/login";
import { environment } from "../../../environments/environment.dev";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    // Base URL for all authentication-related API calls
    private baseUrl = environment.apiUrl;
    private verifyUrl = `${this.baseUrl}/sys/verify-otp`;
    private requestUrl = `${this.baseUrl}/sys/request-otp`;
    private tokenUrl = `${this.baseUrl}/sys/token`;
    private loginUrl = `${this.baseUrl}/sys/login`;
    private resetPasswordUrl = `${this.baseUrl}/sys/reset-password`;

    /**
     * Constructor for AuthService
     * @param http Angular HttpClient for performing HTTP requests
     */
    constructor(private http: HttpClient) {
        console.log("Current API URL: ", this.baseUrl);
     }

    /**
     * Sends a request to generate and send an OTP to the user.
     * @param payload - The OTP payload containing the user's email or phone number.
     * @returns Observable<any> - Emits the API response on success or an error on failure.
     */
    requestOtp(payload: requestOtpRequest): Observable<any> {
        console.log("Request Payload:", payload);
        // return of(true);
        return this.http.post(this.requestUrl, payload).pipe(
            catchError((error) => {
                console.error('Request OTP failed:', error);
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
        return this.http.post(this.verifyUrl, payload).pipe(
            catchError((error) => {
                console.error('Details:', error);
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
        // return throwError(() => new Error('Unauthorized - Invalid credentials'));
        return this.http.post(this.loginUrl, payload).pipe(
            tap((response: any) => {
                console.log('Login success');
                localStorage.setItem('access_token', response.access_token);
            }),
            map((response) => {
                // Return only the necessary data from the response
                let { access_token, ...data } = response;
                return data;
            }),
            catchError((error) => {
                console.error("Details:", error);
                return throwError(() => error);
            })
        );
    };

    resetPassword(payload: any): Observable<any> {
        // console.log("Reset Payload:", payload);
        return of(true);
        return this.http.post(this.resetPasswordUrl, payload).pipe(

        )
    }
}