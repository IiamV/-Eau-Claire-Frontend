import { Component, Output, EventEmitter, Input, ViewChildren, QueryList, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './otp-input.html',
  styleUrls: ['./otp-input.css']
})
export class OtpInputComponent implements OnInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  @Input() otpLength: number = 1;
  @Input() isDisabled: boolean = false;
  @Input() extraInputClass: string = '';
  @Input() extraContainerClass: string = '';

  @Output() otpComplete = new EventEmitter<string>();
  @Output() otpChange = new EventEmitter<string>();

  otp: string[] = [];
  autoFocus: boolean = true;

  ngOnInit(): void {
    this.otp = new Array(this.otpLength).fill('');
  }

  ngAfterViewInit(): void {
    if (this.autoFocus) {
      // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => this.focusInput(0), 0);
    }
  }

  onOtpInput(event: Event, index: number): void {
    if (this.isDisabled) return;

    const input = event.target as HTMLInputElement;
    const value = input.value.replaceAll(/[^\d]/g, '');

    if (value.length > 1) {
      this.handlePaste(value, index);
      return;
    }

    this.otp[index] = value;
    input.value = value;
    this.emitOtpChange();

    if (value && index < this.otpLength - 1) {
      this.focusInput(index + 1);
    }

    this.checkCompletion();
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    if (this.isDisabled) return;
    const isCtrlV = event.ctrlKey && event.key.toLowerCase() === 'v';
    if (isCtrlV) return; // allow browser paste

    switch (event.key) {
      case 'Backspace':
        this.handleBackspace(index);
        event.preventDefault();
        break;
      case 'ArrowLeft':
        if (index > 0) {
          this.focusInput(index - 1);
          event.preventDefault();
        }
        break;
      case 'ArrowRight':
        if (index < this.otpLength - 1) {
          this.focusInput(index + 1);
          event.preventDefault();
        }
        break;
      case 'Home':
        this.focusInput(0);
        event.preventDefault();
        break;
      case 'End':
        this.focusInput(this.otpLength - 1);
        event.preventDefault();
        break;
      default:
        if (/^\d$/.test(event.key)) {
          this.handleDigitInput(event.key, index);
          event.preventDefault();  // ← this line is crucial
        } else if (event.key.length === 1) {
          event.preventDefault();  // ← blocks other key combos too
        }
    }
  }

  onPaste(event: ClipboardEvent, index: number): void {
    console.log(event.clipboardData);
    if (this.isDisabled) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replaceAll(/[^\d]/g, '');

    if (digits) {
      this.handlePaste(digits, index);
    }
  }

  private handleBackspace(index: number): void {
    if (!this.otp[index] && index > 0) {
      const prevInput = this.otpInputs.toArray()[index - 1];
      if (prevInput) {
        prevInput.nativeElement.value = '';  // ← Added this to clear the input element
      }
      this.focusInput(index - 1);
    } else {
      this.otp[index] = '';
    }
    this.emitOtpChange();
  }

  private handleDigitInput(digit: string, index: number): void {
    this.otp[index] = digit;
    const input = this.otpInputs.toArray()[index];
    if (input) {
      input.nativeElement.value = digit;
    }
    this.emitOtpChange();

    if (index < this.otpLength - 1) {
      this.focusInput(index + 1);
    }

    this.checkCompletion();
  }

  private handlePaste(digits: string, startIndex: number): void {
    const digitsArray = digits.slice(0, this.otpLength).split('');
    const inputs = this.otpInputs.toArray();

    for (let i = 0; i < digitsArray.length && (startIndex + i) < this.otpLength; i++) {
      const currentIndex = startIndex + i;
      this.otp[currentIndex] = digitsArray[i];

      const inputElement = inputs[currentIndex];
      if (inputElement) {
        inputElement.nativeElement.value = digitsArray[i];
      }
    }

    const nextEmptyIndex = this.otp.findIndex((digit, idx) => idx > startIndex && !digit);
    const focusIndex = nextEmptyIndex !== -1
      ? nextEmptyIndex
      : Math.min(startIndex + digitsArray.length, this.otpLength - 1);

    this.focusInput(focusIndex);
    this.emitOtpChange();
    this.checkCompletion();
  }

  private focusInput(index: number): void {
    const inputElement = this.otpInputs.toArray()[index];
    if (inputElement) {
      inputElement.nativeElement.focus();
      inputElement.nativeElement.select();
    }
  }

  private checkCompletion(): void {
    if (this.otp.every(digit => digit !== '') && this.otp.length === this.otpLength) {
      this.otpComplete.emit(this.otp.join(''));
    }
  }

  private emitOtpChange(): void {
    this.otpChange.emit(this.otp.join(''));
  }

  // Public API methods
  public clearOtp(): void {
    this.otp = new Array(this.otpLength).fill('');
    this.otpInputs.forEach(input => {
      input.nativeElement.value = '';
    });
    if (!this.isDisabled) {
      this.focusInput(0);
    }
    this.emitOtpChange();
  }

  public setValue(value: string): void {
    const digits = (value || '').replaceAll(/[^\d]/g, '').slice(0, this.otpLength);
    this.otp = [...digits.split(''), ...new Array(this.otpLength - digits.length).fill('')];

    this.otpInputs.forEach((input, index) => {
      input.nativeElement.value = this.otp[index];
    });

    this.emitOtpChange();
    this.checkCompletion();
  }

  public getValue(): string {
    return this.otp.join('');
  }

  public focus(): void {
    if (!this.isDisabled) {
      this.focusInput(0);
    }
  }
}