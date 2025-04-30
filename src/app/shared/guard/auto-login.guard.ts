import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AuthenticationService } from "../authentication.service";

@Injectable({
  providedIn: "root",
})
export class AutoLoginGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      take(1), // Take the latest value and complete
      map((authenticated) => {
        if (authenticated) {
          this.router.navigate(["/pages/proceed"]);
          return false; // Prevent navigation to the route
        }
        return true; // Allow navigation
      })
    );
  }
}
