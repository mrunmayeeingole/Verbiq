
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { WebsiteRestrictionService } from '../website-restriction.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceGuard implements CanActivate {
  
  constructor(
    private deviceService: WebsiteRestrictionService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Get restriction configuration from route data if available
    const allowMobile = route.data['allowMobile'] || false;
    const redirectUrl = route.data['restrictedRedirectUrl'] || '/mobile-restricted';
    
    if (this.deviceService.isMobileDevice() && !allowMobile) {
      this.router.navigate([redirectUrl]);
      return false;
    }
    
    return true;
  }
}