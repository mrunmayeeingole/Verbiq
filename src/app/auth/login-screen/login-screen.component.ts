import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AuthenticationService } from '../../shared/authentication.service';
import { TokenService } from '../../shared/token.service';
import CommonConstants from '../../shared/constants/global.const';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.css'
})
export class LoginScreenComponent {
  newForm: FormGroup;
  result: any;
  errorMessage: any;
  isSigningIn: boolean = false;
  loginRes: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private tokenService: TokenService

  ) {
    this.newForm = this.fb.group({
      registrationNumber: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  ngOnInit() { }

  onSubmit(): void {
    this.authenticationService.login(this.newForm.value.registrationNumber, this.newForm.value.password).subscribe({
      next: (response) => {
        this.tokenService.setToken(response.token);
        localStorage.setItem(
          CommonConstants.USER_DETAILS_KEY,
          JSON.stringify(response)
        );
        this.tokenService.setToken(response.data.token);
        this.authenticationService.isAuthenticated.next(true);
        this.router.navigate(['/pages/proceed']);
        // this.authenticationService.isAuthenticated.next(true);
        // setTimeout(() => {
        //   this.commonService.showSpinner = this.commonService.showSpinner
        //     ? false
        //     : true;
        // }, 200);
        // setTimeout(() => {
        //   this.loaderService.hide();
        // }, 200);
        // this.toasterService.showSuccess('Login successfully..!', 'Success');
      },
      error: (err) => {
        console.log('err', err);
        // setTimeout(() => {
        //   this.loaderService.hide();
        // }, 200);
        // setTimeout(() => {
        //   this.commonService.showSpinner = this.commonService.showSpinner
        //     ? false
        //     : true;
        // }, 200);
        // this.toasterService.showError(err?.error.message, 'Error');
      },
      complete: () => {
        console.info('complete.!!');
      },
    });
  }

  // onSubmit(form: any): void {
  //   if (form.valid) {
  //     console.log('Form Data:', form.value);
  //     // Perform sign-in logic here
  //   }
  // }
}
