import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { AuthLayout } from "../../../layouts/auth-layout/auth-layout";
import { FormsInput } from "../../ui-components/primary-forms-input/primary-forms-input";
import { Button } from "../../ui-components/button/button";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { resetPasswordRequest } from '../../../models/auth/reset-password';
import { LoadingComponent } from "../../../shared/components/loading/loading";
import { isPlatformBrowser } from '@angular/common';
import { StatusPopupComponent } from "../../../shared/components/status-popup/status-popup";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-reset-password',
  imports: [AuthLayout, FormsInput, Button, ReactiveFormsModule, LoadingComponent, StatusPopupComponent, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  isPopupOpen = signal(false);
  resetForm!: FormGroup;
  isLoading = signal(false);
  payload: resetPasswordRequest = {
    userId: '3',
    newPassword: '',
    confirmPassword: '',
    tempToken: ''
  };
  private token: string | null = null;

  constructor(
    readonly formBuilder: FormBuilder,
    readonly authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.resetForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required, Validators.maxLength(20)]],
    })
  };

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('temp_token');
    };
  }

  onResetSubmit() {
    if (this.resetForm.invalid) {
      console.log('Invalid form');
      return;
    }

    this.isLoading.set(true);

    let resetPayload: resetPasswordRequest = {
      ...this.payload,
      newPassword: this.resetForm.value.newPassword,
      confirmPassword: this.resetForm.value.confirmPassword,
      tempToken: this.token || ''
    }

    this.authService.resetPassword(resetPayload).subscribe({
      next: (response) => {
        console.log('Reset Password Success:', response);
        this.isLoading.set(false);
        this.isPopupOpen.set(true);
      },
      error: (error) => {
        console.error('Details:', error);
        this.isLoading.set(false);
      }
    })
  }
}