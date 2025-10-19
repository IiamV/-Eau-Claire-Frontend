import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthLayout } from '../../ui-components/auth-layout/auth-layout';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { otp } from '../../../models/otp';
import { AuthService } from '../../services/auth.service';
import { tempToken } from '../../../models/auth';
import { Button } from '../../ui-components/button/button';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [AuthLayout, Button, RouterLink, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgetPassword {
  
  constructor(
    private router: Router
  ) { }

  goBack() {
    this.router.navigate(['/login']);
  }
}