import { Routes } from '@angular/router';
import { Login } from './auth/containters/login/login';
import { ForgetPassword } from './auth/containters/forgot-password/forgot-password';
import { OtpVerification } from './auth/containters/otp-verification/otp-verification';
import { ResetPassword } from './auth/containters/reset-password/reset-password';

export const routes: Routes = [
    // Mặc định vào trang login
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // Định nghĩa các trang trong luồng Authentication (đăng nhập, đăng ký, quên mật khẩu, OTP)
    { path: 'login', component: Login },
    { path: 'forgot-password', component: ForgetPassword },
    { path: 'otp-verification', component: OtpVerification },
    { path: 'reset-password', component: ResetPassword },

    // Trang sau khi đăng nhập
    // Hiện chưa làm

    // Xử lý đường dẫn không hợp lệ
    { path: '**', redirectTo: 'login' }
];
