import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [],
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
