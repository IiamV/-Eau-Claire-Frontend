import { Component } from '@angular/core';
import { AuthLayout } from "../../ui-components/auth-layout/auth-layout";
import { FormsInput } from "../../ui-components/primary-forms-input/primary-forms-input";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-otp-verification',
  imports: [AuthLayout, FormsInput, RouterLink],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.css'
})
export class OtpVerification {

}
