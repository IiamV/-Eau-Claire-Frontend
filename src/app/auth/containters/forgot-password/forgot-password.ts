import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthLayout } from '../../../layouts/auth-layout/auth-layout';
import { Button } from '../../ui-components/button/button';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [AuthLayout, Button, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})

export class ForgetPassword {
  title = signal('Quên mật khẩu');

  constructor(
    readonly route: ActivatedRoute,
    readonly router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['title']) {
        this.title.set(params['title']);
      }
    });
  };

  goNext(verifyMethod: 'email' | 'sms'): void {
    this.router.navigate(['/otp-verification'], {
      queryParams: {
        verifyMethod: verifyMethod,
        ...(this.title() ? { title: this.title() } : {}),
      }
    });
  }
}