// src/app/services/media-permissions.service.ts

import { Injectable } from '@angular/core';
import { Observable, from, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface MediaPermissionsResult {
  camera: boolean;
  microphone: boolean;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MediaPermissionsService {
  private mediaStream = new BehaviorSubject<MediaStream | null>(null);
  mediaStream$ = this.mediaStream.asObservable();
  
  /**
   * Request camera and microphone permissions
   * @returns Observable with permission results for camera and microphone
   */
  requestPermissions(): Observable<MediaPermissionsResult> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return of({
        camera: false,
        microphone: false,
        errors: ['Your browser does not support camera and microphone access']
      });
    }
    return from(navigator.mediaDevices.getUserMedia({ video: true, audio: true }))
      .pipe(
        tap(stream => {
          this.mediaStream.next(stream);
        }),
        map(stream => {
          return {
            camera: stream.getVideoTracks().length > 0,
            microphone: stream.getAudioTracks().length > 0
          };
        }),
        catchError(error => {
          console.error('Media permission error:', error);
          const errorMsg = error.message || 'Unknown error';
          const result: MediaPermissionsResult = {
            camera: false,
            microphone: false,
            errors: [errorMsg]
          };
          if (errorMsg.includes('audio')) {
            result.camera = true;
          } else if (errorMsg.includes('video')) {
            result.microphone = true;
          }
          
          return of(result);
        })
      );
  }
  
  /**
   * Check if permissions are already granted
   * @returns Observable with current permission status
   */
  checkPermissionStatus(): Observable<MediaPermissionsResult> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return of({
        camera: false,
        microphone: false,
        errors: ['Browser does not support permission checking']
      });
    }    
    return from(navigator.mediaDevices.enumerateDevices())
      .pipe(
        map(devices => {
          const result: MediaPermissionsResult = {
            camera: false,
            microphone: false
          };          
          devices.forEach(device => {
            if (device.kind === 'videoinput' && device.label) {
              result.camera = true;
            }
            if (device.kind === 'audioinput' && device.label) {
              result.microphone = true;
            }
          });          
          return result;
        }),
        catchError(error => {
          return of({
            camera: false,
            microphone: false,
            errors: [error.message || 'Failed to check permission status']
          });
        })
      );
  }
  
  /**
   * Get the current media stream
   * @returns Current MediaStream or null
   */
  getCurrentStream(): MediaStream | null {
    return this.mediaStream.value;
  }
  
  stopMediaTracks(): void {
    const stream = this.mediaStream.value;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      this.mediaStream.next(null);
    }
  }
}