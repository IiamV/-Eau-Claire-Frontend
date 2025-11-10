import { Component, Inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl, FormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
//import { AuthService } from '../../core/services/auth.service';
import { AuthLayout } from "../../../layouts/auth-layout/auth-layout";
import { FormsInput } from "../../ui-components/primary-forms-input/primary-forms-input";
import { Button } from "../../ui-components/button/button";
import { loginRequest } from '../../../models/auth/login';
import { AuthService } from '../../services/auth.service';
import { DeviceFingerprintService } from '../../services/device.service';
import { LoadingComponent } from "../../../shared/components/loading/loading";
import { StatusPopupComponent } from "../../../shared/components/status-popup/status-popup";

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, AuthLayout, FormsInput, Button, LoadingComponent],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  title = 'Eau Claire Fish Farm Management System';
  deviceId: string = '';
  isLoading = signal(false);
  errorMessage = '';

  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private deviceService: DeviceFingerprintService,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required,
                      // Validators.pattern('^[a-zA-Z0-9.-_+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+|\\+?[0-9]{10,15}$'),
                      Validators.maxLength(20)]],
      password: ['', [Validators.required,
                      Validators.maxLength(20)]],
      deviceId: [''],
    })
  };

  ngOnInit() {
    this.deviceService.getDeviceId().then(
      (id) => {
        if (id) {
          // this.deviceId = id;
          this.deviceId = '123';
        }
      }
    );
  }

  redirecToOTP() {
    let method = this.loginForm.get('username')?.value.includes('@') ? 'email' : 'sms';

    this.router.navigate(['/otp-verification'], {
      queryParams: {
        verifyMethod: method,
        sms: this.loginForm.get('username')?.value
      }
    });
  }

  onLoginSubmit() {
    this.errorMessage = '';
    // Validate form before proceeding
    if (this.loginForm.invalid) {
      this.errorMessage='Invalid Input'

      let userInput = this.loginForm.get('username');
      if (userInput?.hasError('required')) {
        this.errorMessage = 'Vui lòng nhập tên đăng nhập.'
      } else if (userInput?.hasError('pattern') && userInput.value.includes('@')) {
        this.errorMessage = 'Sai định dạng email.'
      } else {
        this.errorMessage = 'Sai định dạng sms.'
      }

      let passwordInput = this.loginForm.get('password');
      if (passwordInput?.hasError('required')) {
        this.errorMessage = 'Vui lòng nhập mật khẩu.'
      }

      return;
    }

    this.isLoading.set(true);
    let loginPayload: loginRequest = {
      ...this.loginForm.value,
      deviceId: this.deviceId
    };

    // console.log("Login Payload:", loginPayload);
    this.authService.login(loginPayload).subscribe({
      next: (response) => {
        console.log("Login success:", response);
        this.isLoading.set(false);
        this.router.navigate(['/admin-dashboard']);
      },
      error: (error) => {
        this.errorMessage = "Request Failure.";
        switch (error.status) {
          case 401:
            console.log("Unauthorized - Invalid credentials");
            if (!error.error.isDeviceVerified && error.error.message.includes("Device is not verified")) {
              this.redirecToOTP();
            }
            else {
              this.errorMessage="Tên đăng nhập hoặc mật khẩu không chính xác.";
            }
            break;
          case 409:
            console.log("Device is not verified");
            break;
          case 500:
            console.log("Internal server error");
            break;
        }
        console.error("Details:", error);
        this.isLoading.set(false);
      }
    });
  };
};