import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioRecordingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadAudio(audioBlob: Blob, paragraphId: string): Observable<any> {
    const formData = new FormData();
    formData.append('audio', audioBlob, `reading_${paragraphId}.webm`);
    formData.append('paragraphId', paragraphId);
    formData.append('timestamp', new Date().toISOString());
    
    return this.http.post(`${this.apiUrl}/upload-audio`, formData);
  }

  // Method to convert audio to different format if needed
  convertAudioFormat(audioBlob: Blob, targetFormat: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      // This would need more complex implementation using AudioContext
      // For now, we'll just return the original blob
      resolve(audioBlob);
    });
  }

  // Method to get audio duration
  getAudioDuration(audioBlob: Blob): Promise<number> {
    return new Promise((resolve, reject) => {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        URL.revokeObjectURL(audioUrl);
        resolve(duration);
      });
      
      audio.addEventListener('error', (error) => {
        URL.revokeObjectURL(audioUrl);
        reject(error);
      });
    });
  }
}
