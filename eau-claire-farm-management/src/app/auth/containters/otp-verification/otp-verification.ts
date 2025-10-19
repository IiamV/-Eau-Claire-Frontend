import { Component, signal } from '@angular/core';
import { AuthLayout } from "../../ui-components/auth-layout/auth-layout";
import { FormsInput } from "../../ui-components/primary-forms-input/primary-forms-input";
import { Router,RouterLink, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { tempToken, accessToken } from '../../../models/auth';
import { otp } from '../../../models/otp';

@Component({
  selector: 'app-otp-verification',
  imports: [AuthLayout, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.css'
})

export class OtpVerification {
  
  /**
   * Signal used to manage OTP sent status.
   * false: show email/phone input form
   * true: show OTP input form
   */
  isOtpSent = signal(false);

  // FormControl for email or phone input
  requestFormControl = new FormControl('');

  // Payload object to send OTP request or verification
  otpPayload: otp = {
    method: null,
    userId: 0,
    deviceId: '',
    phone: '',
    email: '',
    inputOtp: '',
  };
  // tempTokenPayload! : tempToken;

  // Mảng để lưu trữ các giá trị của ô OTP
  otp: string[] = new Array(6).fill('');

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
    // Subscribe to query parameters to get verification method (email/phone)
    this.route.queryParams.subscribe(params => {
      this.otpPayload.method = params['verifyMethod'];
    })
  }

  /**
   * Triggered when the user clicks "Send OTP".
   * Validates OTP length and calls verifyOtp API.
   */
  sendOtp(): void {
    let currentOtp = this.otp.join('');
    // Validate OTP
    if (currentOtp.length < 6) {
      console.log("Not valid OTP");
      return;
    }

    // Update payload with entered OTP
    this.otpPayload = {
      ...this.otpPayload,
      inputOtp: currentOtp
    };
    console.log("Current Payload:", this.otpPayload);

    // Call API to verify OTP
    this.authService.verifyOtp(this.otpPayload).subscribe({
      next: (response) => {
        console.log("Request OTP Success:", response);
        this.isOtpSent.set(true);
      },
      error: (error) => {
        console.log("Request OTP Failed:", error);
        this.isOtpSent.set(false);
      }
    });
  }

  /**
   * Sends OTP request to the server using email or phone input.
   * Validates input before calling the API.
   */
  requestOtp(): void {
    // Validate input
    if (!this.requestFormControl.value) {
      console.log("No email or phone number provided.");
      return;
    }

    // Prepare payload based on verification method
    this.otpPayload = {
      ...this.otpPayload,
      email: this.otpPayload.method === 'email' ? this.requestFormControl.value : '',
      phone: this.otpPayload.method === 'phone' ? this.requestFormControl.value : ''
    };

    // Call API to request OTP
    this.authService.requestOtp(this.otpPayload).subscribe({
      next: (response) => {
        console.log("Request OTP Success:", response);
        this.isOtpSent.set(true);
      },
      error: (error) => {
        console.log("Request OTP Failed:", error);
        this.isOtpSent.set(false);
      }
    });
  }

  /**
   * Hàm này được gọi khi người dùng nhấn "Quay lại" từ màn hình nhập OTP
   * để quay về màn hình nhập email.
   */
  goBackToEmailInput() {
    this.isOtpSent.set(false);
  }

  /**
   * Xử lý sự kiện khi người dùng nhập liệu vào ô OTP.
   * Tự động di chuyển focus đến ô tiếp theo.
   * @param event - Sự kiện bàn phím
   * @param index - Vị trí của ô input hiện tại
   */

  onOtpInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Chir cho phép lấy ký tự số
    if (value && !/^\d*$/.test(value)) {
      input.value = value.replace(/[^\d]/g, '');
    }
    value = input.value;
    this.otp[index] = value;

    if (value.length > 1) {
      input.value = value.slice(0, 1);
    }

    // Tuwj động focus vào ô tiếp theo nếu đã nhập thành công
    if (value && index < 5) {
      const nextInput = document.getElementById('otp-' + (index + 1));
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  /**
   * Xử lý sự kiện nhấn phím Backspace.
   * Di chuyển focus về ô phía trước nếu ô hiện tại trống.
   * @param event - Sự kiện bàn phím
   * @param index - Vị trí của ô input hiện tại
   */
  onOtpKeyDown(event: KeyboardEvent, index: number) {
    if (event.key == 'Backspace' && index > 0 && !this.otp[index]) {
      const prevInput = document.getElementById('otp-' + (index - 1));
      if (prevInput) {
        prevInput.focus()
      }
    }
  }
}