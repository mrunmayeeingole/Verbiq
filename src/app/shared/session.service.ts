import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionID: string | null = null;

  setSessionID(sessionID: string) {
    this.sessionID = sessionID;
  }

  getSessionID(): string | null {
    return this.sessionID;
  }
}
