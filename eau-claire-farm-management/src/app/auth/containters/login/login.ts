import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl, FormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
//import { AuthService } from '../../core/services/auth.service';
import { AuthLayout } from "../../ui-components/auth-layout/auth-layout";
import { FormsInput } from "../../ui-components/primary-forms-input/primary-forms-input";
import { Button } from "../../ui-components/button/button";
import { loginRequest } from '../../../models/auth/login';
import { AuthService } from '../../services/auth.service';
import { DeviceFingerprintService } from '../../services/device.service';
import { LoadingComponent } from "../../../shared/components/loading/loading";

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
  isPopupOpen = signal(true);

  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private deviceService: DeviceFingerprintService,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required,
      Validators.pattern('^[a-zA-Z0-9.@]+$')]],
      password: ['', Validators.required],
      deviceId: [''],
    })
  };

  ngOnInit() {
    this.deviceService.getDeviceId().then(
      (id) => {
        if (id) {
          this.deviceId = id;
        }
      }
    );
  }

  redirecToForgotPassword() {
    let method = this.loginForm.get('username')?.value.includes('@') ? 'email' : 'sms';

    this.router.navigate(['/otp-verification'], {
      queryParams: {
        verifyMethod: method
      }
    });
  }

  onLoginSubmit() {
    this.errorMessage = '';
    // Validate form before proceeding
    if (this.loginForm.invalid) {
      let passwordInput = this.loginForm.get('password');
      if (passwordInput?.hasError('required')) {
        this.errorMessage = 'Vui lòng nhập mật khẩu.'
      }

      let userInput = this.loginForm.get('username');
      if (userInput?.hasError('required')) {
        this.errorMessage = 'Vui lòng nhập tên đăng nhập.'
      }

      // this.errorMessage='Invalid Input'
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
        // this.router.navigate(['/home']);
      },
      error: (error) => {
        this.errorMessage = error.message;
        switch (error.status) {
          case 401:
            console.log("Unauthorized - Invalid credentials");
            // this.router.navigate(['/forgot-password', ]);
            // this.redirecToForgotPassword();
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