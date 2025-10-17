import { Component, signal } from '@angular/core';
import { AuthLayout } from "../../ui-components/auth-layout/auth-layout";
import { FormsInput } from "../../ui-components/primary-forms-input/primary-forms-input";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-otp-verification',
  imports: [AuthLayout, RouterLink],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.css'
})
export class OtpVerification {
  // Sử dụng signal để quản lý trạng thái đã gửi OTP hay chưa
  // Ban đầu, isOtpSent là false => Hiển thị form nhập email
  isOtpSent = signal(false);
  userEmail = 'An3439201@gmail.com'

  // Mảng để lưu trữ các giá trị của ô OTP
  otp: string[] = new Array(6).fill('');

  /**
   * Hàm này được gọi khi người dùng nhấn nút "Gửi mã xác nhận"
   * Nó sẽ chuyển trạng thái để hiển thị giao diện nhập OTP
   */
  sendOtp() {
    // Gọi API để gửi OTP
    this.isOtpSent.set(true);
  }

  /**
   * Hàm này được gọi khi người dùng nhấn "Quay lại" từ màn hình nhập OTP
   * để quay về màn hình nhập email.
   */
  goBackToEmailInput() {
    this.isOtpSent.set(false);
  }

  /**
   * Xử lý sự kiện khi người dùng nhập liệu vào ô OTP.
   * Tự động di chuyển focus đến ô tiếp theo.
   * @param event - Sự kiện bàn phím
   * @param index - Vị trí của ô input hiện tại
   */

  onOtpInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Chir cho phép lấy ký tự số
    if (value && !/^\d*$/.test(value)) {
      input.value = value.replace(/[^\d]/g, '');
    }
    value = input.value;
    this.otp[index] = value;

    if (value.length > 1) {
      input.value = value.slice(0, 1);
    }

    // Tuwj động focus vào ô tiếp theo nếu đã nhập thành công
    if (value && index < 5) {
      const nextInput = document.getElementById('otp-' + (index + 1));
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  /**
   * Xử lý sự kiện nhấn phím Backspace.
   * Di chuyển focus về ô phía trước nếu ô hiện tại trống.
   * @param event - Sự kiện bàn phím
   * @param index - Vị trí của ô input hiện tại
   */
  onOtpKeyDown(event: KeyboardEvent, index: number) {
    if (event.key == 'Backspace' && index > 0 && !this.otp[index]) {
      const prevInput = document.getElementById('otp-' + (index - 1));
      if (prevInput) {
        prevInput.focus()
      }
    }
  }
}
