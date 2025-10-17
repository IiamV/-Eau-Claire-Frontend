import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthLayout } from '../../ui-components/auth-layout/auth-layout';
import { Button } from "../../ui-components/button/button";

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [AuthLayout, Button, RouterLink],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css'
})
export class ForgetPassword {

  constructor(
    private router: Router,
  ) { }

  goBack() {
    this.router.navigate(['/login']);
  }

  goToOTPVerification() {
    this.router.navigate(['/otp-verification']);
  }
}
