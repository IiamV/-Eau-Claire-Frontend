import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
//import { AuthService } from '../../core/services/auth.service';
import { AuthLayout } from "../../ui-components/auth-layout/auth-layout";
import { FormsInput } from "../../ui-components/primary-forms-input/primary-forms-input";
import { Button } from "../../ui-components/button/button";
import { StatusPopupComponent } from '../../../shared/components/status-popup/status-popup';
import { loginRequest } from '../../../models/auth/login';
import { AuthService } from '../../services/auth.service';
import { DeviceFingerprintService } from '../../services/device.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, AuthLayout, FormsInput, Button, StatusPopupComponent],
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
    private deviceService: DeviceFingerprintService
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

  closePopup() {
    this.isPopupOpen.set(false);
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
    // Validate form before proceeding
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      console.log("Invalid form:", this.loginForm.value);
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
        console.log("Details:", error);
        this.isLoading.set(false);
      }
    });
  };
};