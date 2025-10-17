import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { AuthLayout } from '../../ui-components/auth-layout/auth-layout';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [AuthLayout],
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
}
