import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, catchError, throwError } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  // Define API

  apiURL: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getUserId() {
    return localStorage.getItem("userId");
  }

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     "Content-Type": "application/json",
  //   }),
  // };

  // public readJSONData(apiURL: any): Observable<any> {
  //   return this.http.get<any>(apiURL).pipe(retry(1), catchError(this.handleError));
  // }

  // public get(endPoint: any, page?: any, limit?: any): Observable<any> {
  //   return this.http.get<any>(`${this.apiURL}/${endPoint}?page=${page}&limit=${limit}`).pipe(retry(1), catchError(this.handleError));
  // }

  // public getById(endPoint: any, id: any): Observable<any> {
  //   return this.http.get<any>(`${this.apiURL}/${endPoint}/${id}`).pipe(retry(1), catchError(this.handleError));
  // }

  // public post(endPoint: any, data: any): Observable<any> {
  //   return this.http
  //     .post<any>(`${this.apiURL}/${endPoint}`, data, this.httpOptions)
  //     .pipe(retry(1), catchError(this.handleError));
  // }

  // public put(endPoint: any, id: any, data: any): Observable<any> {
  //   return this.http
  //     .put<any>(`${this.apiURL}/${endPoint}/${id}`, data, this.httpOptions)
  //     .pipe(retry(1), catchError(this.handleError));
  // }

  // public delete(endPoint: any, id: any) {
  //   return this.http
  //     .delete<any>(`${this.apiURL}/${endPoint}/${id}`, this.httpOptions)
  //     .pipe(retry(1), catchError(this.handleError));
  // }

  // // Error handling
  // handleError(error: any) {
  //   let errorMessage = "";
  //   if (error.error instanceof ErrorEvent) {
  //     // Get client-side error
  //     errorMessage = error.error.message;
  //   } else {
  //     // Get server-side error
  //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //   }
  //   window.alert(errorMessage);
  //   return throwError(() => {
  //     return errorMessage;
  //   });
  // }
}
