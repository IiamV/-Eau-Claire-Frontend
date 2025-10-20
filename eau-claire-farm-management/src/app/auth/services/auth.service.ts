import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { otp } from "../../models/otp";
import { catchError, Observable, throwError, tap } from "rxjs";
import { environment } from "../../../environments/environment.dev";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    /**
     * Base URL for all authentication-related API calls.
     * Retrieved from the environment configuration.
     */
    private baseUrl = environment.baseUrl;

    /**
     * Constructor for AuthService
     * @param http Angular HttpClient for performing HTTP requests
     */
    constructor(private http: HttpClient) {}

    /**
     * Sends a request to generate and send an OTP to the user.
     * @param payload - The OTP payload containing the user's email or phone number.
     * @returns Observable<any> - Emits the API response on success or an error on failure.
     */
    requestOtp(payload: otp): Observable<any> {
        const url = `${this.baseUrl}/sys/request-otp`;

        return this.http.post(url, payload).pipe(
            tap((response) => {
                console.log('Request OTP success:', response);
            }),
            catchError((error) => {
                // Handle specific API error codes
                switch (error.status) {
                    case 400:
                        console.error("Bad Request - Invalid method or contact info");
                        break;
                    default:
                        console.error("Request OTP failed: ", error);
                        break;
                };
                // Forward the error to subscribers
                return throwError(() => new Error(
                    error.message || 'Request OTP failed'
                ));
            })
        );
    };

    /**
     * Verifies the OTP entered by the user.
     * @param payload - OTP payload containing the code and contact info.
     * @returns Observable<any> - Emits API verification result or an error.
     */
    verifyOtp(payload: otp): Observable<any> {
        const url = `${this.baseUrl}/sys/verify-otp`;

        return this.http.post(url, payload).pipe(
            tap((response) => {
                console.log('Verify OTP success:', response);
            }),
            catchError((error) => {
                switch (error.status) {
                    case 400:
                        console.error("Bad Request - Invalid OTP or missing required fields");
                        break;
                    default:
                        console.error("OTP verification failed:", error);
                        break;
                }
                return throwError(() => new Error(
                    error.message || 'OTP verification failed - No Response'
                ));
            })
        );
    };
}