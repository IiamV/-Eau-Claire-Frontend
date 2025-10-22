import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceFingerprintService {
  private fpPromise: Promise<any> | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Initialize the agent only in browser environment
    if (this.isBrowser) {
      this.fpPromise = FingerprintJS.load();
    }
  }

  /**
   * Get a unique device ID based on browser fingerprinting
   * @returns Promise<string> - Unique visitor/device identifier, or null if not in browser
   */
  getDeviceId(): Promise<string | null> {
    if (!this.isBrowser) {
      return Promise.resolve(null);
    }

    if (!this.fpPromise) {
      this.fpPromise = FingerprintJS.load();
    }

    return this.fpPromise
      .then(fp => fp.get())
      .then(result => result.visitorId)
      .catch(error => {
        console.error('Error getting device fingerprint:', error);
        return null;
      });
  }

  /**
   * Get detailed device fingerprint information
   * @returns Promise with visitorId and all components, or null if not in browser
   */
  getDeviceFingerprint(): Promise<any> {
    if (!this.isBrowser) {
      return Promise.resolve(null);
    }

    if (!this.fpPromise) {
      this.fpPromise = FingerprintJS.load();
    }

    return this.fpPromise
      .then(fp => fp.get())
      .then(result => ({
        visitorId: result.visitorId,
        confidence: result.confidence,
        components: result.components
      }))
      .catch(error => {
        console.error('Error getting device fingerprint:', error);
        return null;
      });
  }

  /**
   * Check if fingerprinting is available (browser environment)
   * @returns boolean
   */
  isAvailable(): boolean {
    return this.isBrowser;
  }
}