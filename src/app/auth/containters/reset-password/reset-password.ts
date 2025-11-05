import { Component } from '@angular/core';
import { AuthLayout } from "../../../layouts/auth-layout/auth-layout";
import { FormsInput } from "../../ui-components/primary-forms-input/primary-forms-input";
import { Button } from "../../ui-components/button/button";

@Component({
  selector: 'app-reset-password',
  imports: [AuthLayout, FormsInput, Button],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {

}
