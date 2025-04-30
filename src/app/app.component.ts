import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { WebsiteRestrictionService } from './shared/website-restriction.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'verbiq-web-panel';
  isMobileRestricted = false;
  
  constructor( public router: Router,   private deviceService: WebsiteRestrictionService,){
    this.checkScreenSize();
    const welcomeShown = localStorage.getItem('welcomeShown');

    if (welcomeShown === 'true') {
      this.router.navigate(['/pages/can-data']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  ngOnInit() {
    // Check if mobile and set restriction flag
    // this.isMobileRestricted = this.deviceService.isMobileDevice();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobileRestricted = window.innerWidth < 768;
  }
}
