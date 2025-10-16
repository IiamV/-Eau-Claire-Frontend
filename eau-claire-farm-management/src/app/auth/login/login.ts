import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
//import { AuthService } from '../../core/services/auth.service';
import { UiService } from '../../shared/services/ui.service';
import { error } from 'console';
import { ForgetPassword } from '../forget-password/forget-password';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  title = 'Eau Claire Fish Farm Management System';

  constructor(
    private router: Router,
  ) { }

  onLoginSubmit() {
    this.router.navigate(['/forget-password']);
  }
}
