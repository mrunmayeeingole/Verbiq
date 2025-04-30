import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http/http.service';

@Injectable({
  providedIn: 'root'
})

export class MediaRecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private _isRecording = new BehaviorSubject<boolean>(false);
  public isRecording$ = this._isRecording.asObservable();
  
  // For video quality settings
  private videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 24 }
  };
  
  // For audio quality settings
  private audioConstraints = {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  };
  
  constructor() {}
  
  async startRecording(): Promise<boolean> {
    try {
      if (!this.stream) {
        this.stream = await navigator.mediaDevices.getUserMedia({ 
          video: this.videoConstraints, 
          audio: this.audioConstraints 
        });
      }
      
      // Clear previous recording data
      this.recordedChunks = [];
      
      // Try to use webm with VP9 codec for better quality/size ratio
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') 
        ? 'video/webm;codecs=vp9,opus'
        : 'video/webm';
      
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: mimeType,
        videoBitsPerSecond: 2500000 // 2.5 Mbps for good quality
      });
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
          
          // Store chunks periodically in IndexedDB to prevent memory issues with long recordings
          if (this.recordedChunks.length % 10 === 0) {
            this.saveChunksToStorage();
          }
        }
      };
      
      this.mediaRecorder.onstop = () => {
        this._isRecording.next(false);
        console.log('Recording stopped, total chunks:', this.recordedChunks.length);
        // Final save of all chunks
        this.saveChunksToStorage();
      };
      
      this.mediaRecorder.onerror = (event: any) => {
        console.error('MediaRecorder error:', event);
        this._isRecording.next(false);
      };
      
      // Start recording with 1-second chunks
      this.mediaRecorder.start(1000);
      this._isRecording.next(true);      
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      this._isRecording.next(false);
      return false;
    }
  }
  
  private saveChunksToStorage() {
    // This is just a placeholder. In a real implementation,
    // you might want to store chunks progressively to IndexedDB
    // to handle very long recordings without memory issues
    try {
      const tempBlob = new Blob([...this.recordedChunks], { type: 'video/webm' });
      const sessionID = sessionStorage.getItem('sessionID');
      const userId = sessionStorage.getItem('userId');
      
      if (sessionID && userId) {
        sessionStorage.setItem('lastRecordingSize', tempBlob.size.toString());
      }
    } catch (e) {
      console.warn('Failed to save recording chunks to storage:', e);
    }
  }
  
  stopRecording(): Blob | null {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
        return this.getFinalRecording();
      } catch (e) {
        console.error('Error stopping recording:', e);
        return null;
      }
    }
    return null;
  }
  
  pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      try {
        this.mediaRecorder.pause();
      } catch (e) {
        console.error('Error pausing recording:', e);
      }
    }
  }
  
  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      try {
        this.mediaRecorder.resume();
      } catch (e) {
        console.error('Error resuming recording:', e);
      }
    }
  }
  
  getCurrentRecordingBlob(): Blob | null {
    if (this.recordedChunks.length === 0) {
      return null;
    }
    return new Blob([...this.recordedChunks], { type: 'video/webm' });
  }
  
  getFinalRecording(): Blob | null {
    if (this.recordedChunks.length === 0) {
      return null;
    }
    return new Blob(this.recordedChunks, { type: 'video/webm' });
  }
  
  getStreamForPreview(): MediaStream | null {
    return this.stream;
  }
  
  releaseMediaResources(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {
        console.error('Error stopping recorder during cleanup:', e);
      }
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.error('Error stopping track:', e);
        }
      });
      this.stream = null;
    }
    
    this.mediaRecorder = null;
    this._isRecording.next(false);
  }
  
  // Add method to check if browser supports recording
  static checkRecordingSupport(): {supported: boolean, reason?: string} {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        supported: false,
        reason: 'Media devices API not supported in this browser'
      };
    }
    
    if (!window.MediaRecorder) {
      return {
        supported: false,
        reason: 'MediaRecorder API not supported in this browser'
      };
    }
    
    return { supported: true };
  }
}