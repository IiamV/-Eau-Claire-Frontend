import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
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
  
  constructor() { };
}