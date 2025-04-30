import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WebsiteRestrictionService {
  constructor(private router: Router) { }
  
  /**
   * Check if the current device is a mobile device
   * @returns boolean - true if the device is mobile
   */
  isMobileDevice(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Regular expression to check for mobile devices
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    
    return mobileRegex.test(userAgent);
  }
  
  /**
   * Restrict access based on device type
   * @param allowMobile - whether to allow mobile access or not
   * @param redirectUrl - URL to redirect to if restricted
   */
  restrictAccess(allowMobile: boolean = false, redirectUrl: string = '/mobile-restricted'): void {
    const isMobile = this.isMobileDevice();
    
    if (isMobile && !allowMobile) {
      this.router.navigate([redirectUrl]);
    }
  }
}
