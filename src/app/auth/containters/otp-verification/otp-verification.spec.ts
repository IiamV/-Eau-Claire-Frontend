import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpVerification } from './otp-verification';
import { AuthService } from '../../services/auth.service';
import { DeviceFingerprintService } from '../../services/device.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { OtpInputComponent } from '../../ui-components/otp-input/otp-input';
import { LoadingComponent } from "../../../shared/components/loading/loading";
import { Button } from "../../ui-components/button/button";
import { requestOtpRequest, verifyOtpRequest } from '../../../models/auth/otp';

// Mock services
class MockService {
  requestOtp(payload: requestOtpRequest) {
    return of({ success: true });
  }
  requestOtpFail(payload: requestOtpRequest) {
    return of({ success: false });
  }
  verifyOtp(payload: verifyOtpRequest) {
    return of({ success: true });
  }
  getDeviceId() {
    return Promise.resolve('testing-device-123');
  }
}

describe('OtpVerification', () => {
  let component: OtpVerification;
  let fixture: ComponentFixture<OtpVerification>;
  let mockService: MockService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OtpVerification, OtpInputComponent, LoadingComponent, Button],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: MockService, useClass: MockService },
        { provide: Router, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpVerification);
    component = fixture.componentInstance;
    mockService = TestBed.inject(MockService) as unknown as MockService;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call requestOtp and set isOtpSent to true on success', () => {
    spyOn(mockService, 'requestOtp').and.callThrough();
    
    // Simulate form input
    component.requestForm.setValue('test@example.com');
    component.requestOtp();
    
    expect(mockService.requestOtp).toHaveBeenCalled();
    expect(component.isOtpSent()).toBeTrue();
    expect(component.isLoading()).toBeFalse();
  });

  it('should not send OTP if form is invalid', () => {
    spyOn(mockService, 'requestOtp');
    
    // Simulate invalid form input
    component.requestForm.setValue('invalid-email');
    component.requestOtp();
    
    expect(mockService.requestOtp).not.toHaveBeenCalled();
    expect(component.isOtpSent()).toBeFalse();
  });

  it('should call verifyOtp and handle the response', () => {
    spyOn(mockService, 'verifyOtp').and.callThrough();
    
    // Simulate OTP input
    component.otpComponent.getValue = () => '123456'; // Mock OTP input
    component.verifyOtp();
    
    expect(mockService.verifyOtp).toHaveBeenCalled();
    expect(component.isLoading()).toBeFalse();
  });

  it('should handle OTP verification failure', () => {
    spyOn(mockService, 'verifyOtp').and.returnValue(throwError('Verification failed'));
    
    // Simulate OTP input
    component.otpComponent.getValue = () => '123456'; // Mock OTP input
    component.verifyOtp();
    
    expect(mockService.verifyOtp).toHaveBeenCalled();
    expect(component.isLoading()).toBeFalse();
  });

  it('should start OTP timeout correctly', () => {
    component.startOtpTimeout();
    
    expect(component.isOtpActive()).toBeTrue();
    expect(component.isOtpTimeout()).toBeFalse();
    
    // Simulate the timer countdown
    jest.advanceTimersByTime(1000); // Advancing 1 second
    expect(component.otpTime()).toBe(299);
  });

  it('should validate email or phone correctly', () => {
    const emailControl = component.requestForm;
    emailControl.setValue('test@example.com');
    const phoneControl = component.requestForm;
    phoneControl.setValue('+1234567890');
    
    expect(component.emailOrPhoneValidator()(emailControl)).toBeNull();
    expect(component.emailOrPhoneValidator()(phoneControl)).toBeNull();
  });
});
