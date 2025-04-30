import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable, Subscription, retry, throwError } from "rxjs";
// import CommonConstants from "../constants/global.const";
import { catchError } from 'rxjs/operators';
// import { AuthenticationService } from "./authentication.service";
// import { ToastrService } from "ngx-toastr";
import { TokenService } from "../token.service";
import { StorageService } from "../storage.service";
import { AuthenticationService } from "../authentication.service";
import CommonConstants from "../constants/global.const";
import { environment } from "../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class HttpService {
  // Define API
  apiURL: string = environment.apiUrl;

  public token: string='';
  httpOptions!: { headers: HttpHeaders; };
  // private tokenSubscription: Subscription;

  constructor(
    private http: HttpClient,
    // private toastr: ToastrService,
    private tokenService: TokenService,
    private injector: Injector,
    private storageService:StorageService
  ) { 
    this.tokenService.getToken().subscribe(token => {
      this.token = token;
      this.httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.token}`
        }),
      };
    
      console.log('this.this.token', this.token)
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  // getUserDetails() {
  //   return JSON.parse(this.storageService.getItem(CommonConstants.USER_DETAILS_KEY) || "");
  // }


  getUserDetails() {
    const userDetailsString = this.storageService.getItem(CommonConstants.USER_DETAILS_KEY);
    
    if (!userDetailsString) {
      // Handle the case where the item does not exist or is empty
      console.warn('No user details found in storage');
      return null; // or you can return a default object
    }
  
    try {
      return JSON.parse(userDetailsString);
    } catch (error) {
      console.error('Error parsing user details from storage', error);
      return null; // or handle the error as needed
    }
  }

  getUserId() {
    return this.getUserDetails().user._id;
  }

  getMyClass() {
    return this.getUserDetails().data.class;
  }

  getMyMedium() {
    return this.getUserDetails().data.medium;
  }
  
  getFullName(): string {
    return `${this.getUserDetails().firstName}`;
  }
  
  getUserLanguage() {
    return this.getUserDetails().language;
  }

  getUserLanguageId() {
    return this.getUserLanguage().languageId;
  }


  public readJSONData(apiURL: any): Observable<any> {
    return this.http.get<any>(apiURL).pipe(retry(1),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      }));
  }

  public get(endPoint: any): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/${endPoint}`,this.httpOptions).pipe(retry(1),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      }));
  }

  public getById(endPoint: any, id: any): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/${endPoint}/${id}`,this.httpOptions).pipe(retry(1),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      }));
  }

  public post(endPoint: any, data: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiURL}/${endPoint}`, data, this.httpOptions)
      .pipe(retry(1),
        catchError((error: HttpErrorResponse) => {
          this.handleError(error);
          return throwError(() => error);
        }));
  }

  public put(endPoint: any, id: any, data: any): Observable<any> {
    return this.http
      .put<any>(`${this.apiURL}/${endPoint}/${id}`, data, this.httpOptions)
      .pipe(retry(1),
        catchError((error: HttpErrorResponse) => {
          this.handleError(error);
          return throwError(() => error);
        }));
  }

  public delete(endPoint: any, id: any) {
    return this.http
      .delete<any>(`${this.apiURL}/${endPoint}/${id}`, this.httpOptions)
      .pipe(retry(1),
        catchError((error: HttpErrorResponse) => {
          this.handleError(error);
          return throwError(() => error);
        }));
  }

  // Error handling
  handleError(error: any) {
    if (error.status === 401) {
      const auth = this.injector.get(AuthenticationService);
      auth.logout();
      // this.toastr.error(error.error.message);
    }
  }
}
