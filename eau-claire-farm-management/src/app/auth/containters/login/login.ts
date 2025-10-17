import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
//import { AuthService } from '../../core/services/auth.service';
import { AuthLayout } from "../../ui-components/auth-layout/auth-layout";
import { FormsInput } from "../../ui-components/primary-forms-input/primary-forms-input";
import { Button } from "../../ui-components/button/button";

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, AuthLayout, FormsInput, Button],
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
