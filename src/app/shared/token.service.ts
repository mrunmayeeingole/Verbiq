import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import CommonConstants from './constants/global.const';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  
  constructor(private storageService:StorageService) {
    this.initToken();
  }
  
  private initToken(): void {
    const token = this.storageService.getItem(CommonConstants.TOKEN_KEY);
    if (token) {
      this.tokenSubject.next(token);
    }
  }
  
  public getToken(): BehaviorSubject<string> {
    return this.tokenSubject;
  }
  
  public setToken(token: string): void {
    this.storageService.setItem(CommonConstants.TOKEN_KEY, token);
    this.tokenSubject.next(token);
  }
  
  public clearToken(): void {
    this.storageService.removeItem(CommonConstants.TOKEN_KEY);
    this.tokenSubject.next('');
  }
}
