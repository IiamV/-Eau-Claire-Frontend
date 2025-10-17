import { Routes } from '@angular/router';
import { Login } from './auth/containters/login/login';
import { ForgetPassword } from './auth/containters/forget-password/forget-password';
import { OtpVerification } from './auth/containters/otp-verification/otp-verification';

export const routes: Routes = [
    // Mặc định vào trang login
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // Định nghĩa các trang trong luồng Authentication (đăng nhập, đăng ký, quên mật khẩu, OTP)
    { path: 'login', component: Login },
    { path: 'forget-password', component: ForgetPassword },
    { path: 'otp-verification', component: OtpVerification },

    // Trang sau khi đăng nhập
    // Hiện chưa làm

    // Xử lý đường dẫn không hợp lệ
    { path: '**', redirectTo: 'login' }
];
