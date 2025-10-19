import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { otp } from "../../models/otp";
import { catchError, Observable, throwError } from "rxjs";
import { tempToken } from "../../models/auth";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    // Base URL for all authentication-related API calls
    private baseUrl = environment.baseUrl

    /**
     * Constructor for AuthService
     * @param http Angular HttpClient for performing HTTP requests
     */
    constructor(private http: HttpClient) { }

    /**
     * Sends a request to generate and send an OTP to the user.
     * @param payload OTP payload containing email/phone and other details
     * @returns Observable of the API response
     */
    requestOtp(payload: otp): Observable<any> {
        const url = `${this.baseUrl}/sys/request-otp`;

        return this.http.post(url, payload).pipe(
            catchError((error) => {
            console.error('Request OTP failed:', error);
            return throwError(() => new Error(error.message || 'OTP request failed'));
            })
        );
    }

    /**
     * Verifies the OTP entered by the user.
     * @param payload OTP payload containing user input and verification details
     * @returns Observable of the API response
     */
    verifyOtp(payload: otp): Observable<any> {
        const url = `${this.baseUrl}/sys/verify-otp`;

        return this.http.post(url, payload).pipe(
            catchError((error) => {
            console.error('Verify OTP failed:', error);
            return throwError(() => new Error(error.message || 'OTP verification failed'));
            })
        );
    }

    /**
     * Retrieves an access token after OTP verification.
     * @param payload Temporary token payload for authentication
     * @returns Observable of the API response containing access token
     */
    getAccessToken(payload: tempToken): Observable<any> {
        const url = `${this.baseUrl}/sys/token`
        console.log(payload)

        return this.http.post(url, payload).pipe(
            catchError((error) => {
                console.error('Get access token failed:', error);
                return throwError(() => new Error(error.message || 'Get access token failed'));
            })
        )
    }
}