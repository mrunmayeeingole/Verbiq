import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { TokenService } from "./token.service";
import { HttpService } from "./http/http.service";
import CommonConstants from "./constants/global.const";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  // token = this.storageService.getItem(CommonConstants.TOKEN_KEY);
  token: string | null = null;
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor(
    private http: HttpClient, 
    private httpService: HttpService,
    private storageService:StorageService,
    private tokenService: TokenService,
    private router: Router
    ) {
      this.initializeToken();
      this.loadToken();
    }

    private initializeToken(): void {
      this.token = this.storageService.getItem(CommonConstants.TOKEN_KEY);
      // this.isAuthenticated.next(!!this.token); // Update authentication state
    }

  async loadToken() {
    if (this.token) {
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(registrationNumber: any , password: any): Observable<any> {
    let dataTosend = {
      email : registrationNumber,
      password: password,
      // email:email,
      // password: password,
      // deviceRegistrationToken: this.storageService.getItem(CommonConstants.PUSH_TOKEN) || '1234'
    };
    return this.httpService.post("studentRegistration/login", dataTosend);
  }

  signUp(fullName: any , email: any,mobile:any, country:any, password:any, roleId:any): Observable<any> {
    let dataTosend = {
      fullName: fullName,
      email: email,
      mobile: mobile,
      country: country,
      password: password,
      roleId: roleId,

    };
    return this.httpService.post("auth/register", dataTosend);
  }

  skipOtpScreen(comingFrom:any,email:any){
    // this.loaderService.showLoader();
    let endPoint;
    let reqBody;
    if (comingFrom == "signUp") {
      endPoint = "registerOtpVerify";
      reqBody = email;
    } else {
      endPoint = "otpVerify";
      reqBody = '91' + email;
    }

    let sendData = {
      value: reqBody,
      otp: "1234",
      // deviceRegistrationToken: this.storageService.getItem(CommonConstants.PUSH_TOKEN)
    };

    this.httpService.post(endPoint, sendData).subscribe({
      next: (response: any) => {
        this.tokenService.setToken(response.data.token);
        this.storageService.setItem(CommonConstants.USER_DETAILS_KEY, JSON.stringify(response));
        this.isAuthenticated.next(true);
        // setTimeout(() => {
        //   this.loaderService.stopLoader();
        // }, 200);
        // this.toasterService.success("Login successfully..!");
        this.router.navigate(["/b-sat/e-learning"]);
      },
      error: (err: any) => {
        console.log("err", err);
        // setTimeout(() => {
        //   this.loaderService.stopLoader();
        // }, 200);
        // this.toasterService.danger(err?.error?.messages.error);
      },
      complete: () => {
        console.info("complete.!!");
      },
    });
  }

  proceessLoginWithEmailPassword(response:any){
    this.tokenService.setToken(response.data.token);
    this.storageService.setItem(CommonConstants.USER_DETAILS_KEY, JSON.stringify(response));
    this.isAuthenticated.next(true);
    this.router.navigate(["/dashboard/panel"]);
  }

  logout() {
    this.isAuthenticated.next(false)
        this.storageService.removeItem(CommonConstants.USER_DETAILS_KEY);
        this.storageService.removeItem(CommonConstants.TOKEN_KEY);
        // this.storageService.removeItem(CommonConstants.PUSH_TOKEN);
        this.reloadApp();
  }

  reloadApp(): void {
    window.location.reload();
  }

}
