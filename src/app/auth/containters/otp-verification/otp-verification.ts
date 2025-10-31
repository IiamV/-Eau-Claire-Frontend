import { Component, EventEmitter, Output, signal, ViewChild } from '@angular/core';
import { AuthLayout } from "../../ui-components/auth-layout/auth-layout";
import { RouterLink, ActivatedRoute } from "@angular/router";
import { ReactiveFormsModule, Validators, FormControl, FormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { requestOtpRequest, verifyOtpRequest } from '../../../models/auth/otp';
import { DeviceFingerprintService } from '../../services/device.service';
import { FormsInput } from '../../ui-components/primary-forms-input/primary-forms-input';
import { LoadingComponent } from "../../../shared/components/loading/loading";
import { Button } from "../../ui-components/button/button";
import { OtpInputComponent } from "../../ui-components/otp-input/otp-input";

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [AuthLayout, RouterLink, ReactiveFormsModule, FormsModule, LoadingComponent, FormsInput, Button, OtpInputComponent],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.css'
})

export class OtpVerification {
  @ViewChild(OtpInputComponent) otpComponent!: OtpInputComponent;

  /**
   * Signal used to manage OTP sent status.
   * false: show email/phone input form
   * true: show OTP input form
   */
  isOtpSent = signal(false);
  isLoading = signal(false);
  isOtpTimeout = signal(false);
  isOtpActive = signal(false);
  // otpTime = signal(5 * 60);
  otpTime = signal(5 * 60);
  remainingTime = this.otpTime;
  intervalId: any= null;

  // FormControl for email or phone input
  requestForm = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9@.+]+$')]);

  // Payload object to send OTP request or verification
  otpPayload: requestOtpRequest = {
    method: '',
    userId: 3,
    deviceId: '',
    phone: '',
    email: ''
  };

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private deviceService: DeviceFingerprintService,
  ) {
    // Subscribe to query parameters to get verification method (email/phone)
    this.route.queryParams.subscribe(params => {
      this.otpPayload.method = params['verifyMethod']
    }),
      this.deviceService.getDeviceId().then((id) => {
        if (id) {
          this.otpPayload.deviceId = id;
        }
      })
  }

  /**
   * Triggered when the user clicks "Send OTP".
   * Validates OTP length and calls verifyOtp API.
   */
  verifyOtp(): void {
    // Validate OTP
    if (this.otpComponent.getValue().length !== 6) {
      console.log("Invalid OTP");
      return;
    }

    this.isLoading.set(true);

    // Update payload with entered OTP
    let verifyPayload: verifyOtpRequest = {
      ...this.otpPayload,
      purpose: 'generic',
      inputOtp: this.otpComponent.getValue()
    };

    // Call API to verify OTP
    this.authService.verifyOtp(verifyPayload).subscribe({
      next: (response) => {
        console.log("Request OTP Success:", response);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error("Details: ", error);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Sends OTP request to the server using email or phone input.
   * Validates input before calling the API.
   */
  requestOtp(): void {
    // Validate input
    if (!this.requestForm.value) {
      console.log("No email or phone number provided.");
      return;
    }

    if (this.requestForm.invalid) {
      console.log("Invalid email or phone number.");
      return;
    }

    this.isLoading.set(true);

    // Prepare payload based on verification method
    this.otpPayload = {
      ...this.otpPayload,
      email: this.otpPayload.method === 'email' ? this.requestForm.value : '',
      phone: this.otpPayload.method === 'sms' ? this.requestForm.value : ''
    };

    // Call API to request OTP
    this.authService.requestOtp(this.otpPayload).subscribe({
      next: (response) => {
        console.log("Request Response:", response);
        this.isLoading.set(false);
        this.isOtpSent.set(true);
        this.startOtpTimeout();
      },
      error: (error) => {
        console.error("Request Details: ", error);
        this.isOtpSent.set(false);
        this.isLoading.set(false);
      }
    });
  }

  emailOrPhoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }

      // Email regex pattern
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Phone regex pattern (adjust based on your requirements)
      const phonePattern = /^[\d\s\-\+\(\)]+$/;

      const isValidEmail = emailPattern.test(value);
      const isValidPhone = phonePattern.test(value) && value.replace(/\D/g, '').length >= 10;

      if (isValidEmail || isValidPhone) {
        return null; // Valid
      }

      return { emailOrPhone: true }; // Invalid
    };
  }

  startOtpTimeout(): void {
    this.isOtpActive.set(true);
    this.isOtpTimeout.set(false);
    this.otpTime.set(5 * 60);

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.otpTime.update(time => time - 1);
      
      if (this.otpTime() <= 0) {
        this.isOtpActive.set(false);
        this.isOtpTimeout.set(true);
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}