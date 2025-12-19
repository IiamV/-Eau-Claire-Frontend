import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { AuthLayout } from '../../../layouts/auth-layout/auth-layout';
import { ReactiveFormsModule, Validators, FormControl, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RequestOtpRequest, VerifyOtpRequest } from '../../../models/auth/otp';
import { DeviceFingerprintService } from '../../services/device.service';
import { FormsInput } from '../../ui-components/primary-forms-input/primary-forms-input';
import { LoadingComponent } from '../../../shared/components/loading/loading';
import { Button } from '../../ui-components/button/button';
import { OtpInputComponent } from '../../ui-components/otp-input/otp-input';
import { Router, ActivatedRoute } from '@angular/router';
import { ExchangeAuthTokenRequest, ExchangeTempTokenRequest } from '../../../models/auth/token';
import { StatusPopupComponent } from '../../../shared/components/status-popup/status-popup';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [
    AuthLayout,
    ReactiveFormsModule,
    FormsModule,
    LoadingComponent,
    FormsInput,
    Button,
    OtpInputComponent,
    StatusPopupComponent,
  ],
  templateUrl: './otp-verification.html',
})
export class OtpVerification implements OnInit {
  @ViewChild('otpInput') otpComponent!: OtpInputComponent;

  /**
   * Signal used to manage OTP sent status.
   * false: show email/phone input form
   * true: show OTP input form
   */
  isOtpSent = signal(false);
  isLoading = signal(false);
  isOtpTimeout = signal(false);
  isOtpActive = signal(false);
  otpTime = signal(5 * 60);
  remainingTime = this.otpTime;
  intervalId: any = null;
  errorMessage: string = '';
  verifyError = signal(false);
  title = signal('Quên mật khẩu');
  isDeviceOTP = signal(false);
  isPopupOpen = signal(false);

  // FormControl for email or phone input
  requestForm = new FormControl('', [
    Validators.required,
    // Validators.pattern('^[a-zA-Z0-9.-_+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+|\.?[0-9]{10,15}$')
  ]);

  // Payload object to send OTP request or verification
  otpPayload: RequestOtpRequest = {
    method: '',
    userId: 3,
    deviceId: '',
    phone: '',
    email: '',
  };

  constructor(
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly authService: AuthService,
    readonly deviceService: DeviceFingerprintService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initializeDeviceId();
    this.initializeQueryParams();
  }

  private async initializeDeviceId(): Promise<void> {
    const id = await this.deviceService.getDeviceId();
    if (id) {
      this.otpPayload.deviceId = '123';
    }
  }

  private initializeQueryParams(): void {
    this.route.queryParams.subscribe((params) => {
      this.otpPayload.method = params['verifyMethod'];

      if (params['sms']) {
        this.otpPayload.phone = params['sms'];
        this.requestForm.setValue(params['sms']);
      }

      if (params['email']) {
        this.otpPayload.email = params['email'];
        this.requestForm.setValue(params['email']);
      }

      if (params['title']) {
        this.title.set(params['title']);
        this.isDeviceOTP.set(true);

        if (params['isAutoForward']) {
          this.isOtpSent.set(true);
          this.requestOtp();
        }
      }
    });
  }

  /**
   * Triggered when the user clicks "Send OTP".
   * Validates OTP length and calls verifyOtp API.
   */
  clearVerifyOtp(): void {
    this.otpComponent.clearOtp();
    this.verifyError.set(false);
  }

  verifyTempToken(): void {
    let payload: ExchangeTempTokenRequest = {
      tempToken: localStorage.getItem('temp_token') as string,
    };

    if (!payload) {
      return;
    }

    this.authService.exchangeToken(payload).subscribe({
      next: (response) => {
        console.log('Verified Temp Token');
        this.router.navigate(['/reset-password']);
      },
      error: (error) => {
        console.error('Details: ', error);
      },
    });
  }

  verifyDevice(): void {
    let payload: ExchangeAuthTokenRequest = {
      tempToken: localStorage.getItem('temp_token') as string,
    };
    this.authService.exchangeAuthToken(payload).subscribe({
      next: (response) => {
        console.log('Verified Auth Token');
        this.router.navigate(['/admin-dashboard']);
      },
      error: (error) => {
        console.error('Details: ', error);
      },
    });
  }

  verifyOtp(): void {
    this.errorMessage = '';
    this.verifyError.set(false);
    // Validate OTP
    if (this.otpComponent.getValue().length !== 6) {
      this.verifyError.set(true);
      return;
    }

    this.isLoading.set(true);

    // Update payload with entered OTP
    let verifyPayload: VerifyOtpRequest = {
      ...this.otpPayload,
      ...(this.isDeviceOTP() ? { purpose: 'login' } : { purpose: 'generic' }),
      inputOtp: this.otpComponent.getValue(),
    };

    // Call API to verify OTP
    this.authService.verifyOtp(verifyPayload).subscribe({
      next: (response) => {
        console.log('Request OTP Success:', response);
        if (this.isDeviceOTP()) {
          this.verifyDevice();
        } else {
          this.verifyTempToken();
        }
        this.isLoading.set(false);
        this.verifyError.set(false);
      },
      error: (error) => {
        this.verifyError.set(true);
        console.error('Details: ', error);
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Sends OTP request to the server using email or phone input.
   * Validates input before calling the API.
   */
  requestOtp(): void {
    // Validate input
    this.errorMessage = '';
    if (this.requestForm.invalid || !this.requestForm.value) {
      let userInfo = this.requestForm.value;
      if (userInfo === '') {
        if (this.otpPayload.method === 'email') {
          this.errorMessage = 'Vui lòng nhập địa chỉ Email.';
        } else {
          this.errorMessage = 'Vui lòng nhập số điện thoại.';
        }
      }

      if (this.requestForm.hasError('pattern')) {
        if (this.otpPayload.method === 'email') {
          this.errorMessage = 'Sai định dạng địa chỉ email.';
        } else {
          this.errorMessage = 'Sai định dạng số điện thoại.';
        }
      }

      return;
    }

    this.isLoading.set(true);

    // Prepare payload based on verification method
    this.otpPayload = {
      ...this.otpPayload,
      email: this.otpPayload.method === 'email' ? this.requestForm.value : '',
      phone: this.otpPayload.method === 'sms' ? this.requestForm.value : '',
    };

    // Call API to request OTP
    this.authService.requestOtp(this.otpPayload).subscribe({
      next: (response) => {
        console.log('Request Response:', response);
        this.isLoading.set(false);
        this.isOtpSent.set(true);
        this.startOtpTimeout();
      },
      error: (error) => {
        console.error('Request Details: ', error);
        this.errorMessage = 'Request Failure.';
        this.isOtpSent.set(false);
        this.isLoading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/forgot-password'], {
      queryParams: {
        ...(this.isDeviceOTP() ? { title: this.title() } : {}),
      },
    });
  }
  // verifyMethod=sms&sms=minhchau&title=Xác%20minh%20thiết%20bị

  startOtpTimeout(): void {
    this.isOtpActive.set(true);
    this.isOtpTimeout.set(false);
    this.otpTime.set(5 * 60);

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.otpTime.update((time) => time - 1);

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
