import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../shared/authentication.service';
import CommonConstants from '../../shared/constants/global.const';
import { TokenService } from '../../shared/token.service';
import { HttpService } from '../../shared/http/http.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
 signUpForm: FormGroup;
  result: any;
  errorMessage: any;
  isSigningIn: boolean = false;
  loginRes: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private authenticationService: AuthenticationService,
    private tokenService: TokenService

  ) {

    this.signUpForm = this.fb.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
    });
  }

  ngOnInit() { }


  onSubmit(): void {
    let SendData = {
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
      confirmPassword: this.signUpForm.value.confirmPassword,
    }
    this.httpService.post('studentRegistration/createStudentRegistration',SendData).subscribe({
      next: (response) => {
        this.tokenService.setToken(response.token);
        localStorage.setItem(
          CommonConstants.USER_DETAILS_KEY,
          JSON.stringify(response)
        );
        this.tokenService.setToken(response.data.token);
        this.router.navigate(['/auth/can-data']);
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
