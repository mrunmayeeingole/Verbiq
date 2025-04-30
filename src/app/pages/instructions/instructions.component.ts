import { Component } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { MediaPermissionsResult, MediaPermissionsService } from '../../shared/media.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MediaRecordingService } from '../../shared/media-manager.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css'],
})
export class InstructionsComponent {
  instructions: any[] = [];
  permissionsError = '';
  loading: boolean = false;
  apiError: string = '';
  isRecording: boolean = false;

  constructor(
    private httpService: HttpService, 
    private mediaPermissionsService: MediaPermissionsService,  
    private router: Router,
    private mediaRecordingService: MediaRecordingService
  ) {}

  ngOnInit(): void {
    this.getAllInstructions();
    // this.requestPermissions();
    
    this.mediaRecordingService.isRecording$.subscribe(
      isRecording => this.isRecording = isRecording
    );
  }

  ngOnDestroy(): void {
    if (this.isRecording) {
      this.mediaRecordingService.stopRecording();
    }
  }

  requestPermissions() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log('Camera and microphone access granted.');
        this.startRecording();
        this.getAllInstructions(); 
      })
      .catch((error) => {
        console.error('Permission denied:', error);
        alert('Camera and microphone access is required to proceed.');
      });
  }

  startRecording() {
    this.mediaRecordingService.startRecording()
      .then((success: any) => {
        if (success) {
          console.log('Recording started successfully');
        } else {
          console.error('Failed to start recording');
        }
      });
  }

  getAllInstructions() {
    this.loading = true;
    this.apiError = '';
    this.httpService.get('instruction/getAllInstruction').subscribe({
      next: (response) => {
        console.log(response);
        if (response?.data?.length) {
          this.instructions = response.data[0].instructions; 
        }
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.apiError = 'Unable to load instructions. Please try again later.'; 
      },
    });
  }

  onProceedClick(): void {
    this.loading = true;
    this.permissionsError = '';
  
    navigator.permissions.query({ name: 'camera' as PermissionName }).then((cameraPerm) => {
      navigator.permissions.query({ name: 'microphone' as PermissionName }).then((micPerm) => {        
        if (cameraPerm.state === 'denied' || micPerm.state === 'denied') {
          this.permissionsError = 'Camera and microphone access is denied. Please allow permissions in your browser settings.';
          this.loading = false;
          return;
        }  
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((stream) => {
            console.log('Camera and microphone access granted.');            this.startRecording();
            this.navigateToExam();
          })
          .catch((error) => {
            console.error('Permission denied:', error);
            this.permissionsError = 'Camera and microphone access is required to proceed. Please enable permissions and try again.';
          })
          .finally(() => {
            this.loading = false;
          });
      });
    });
  }

  private handlePermissionDenial(result: MediaPermissionsResult): void {
    const missingPermissions = [];
    
    if (!result.camera) {
      missingPermissions.push('Camera');
    }
    if (!result.microphone) {
      missingPermissions.push('Microphone');
    }
    if (missingPermissions.length > 0) {
      this.permissionsError = `${missingPermissions.join(' and ')} access is required to proceed with the exam. Please enable permissions in your browser settings and try again.`;
    } else if (result.errors && result.errors.length > 0) {
      this.permissionsError = result.errors[0];
    }
  }

  private navigateToExam(){
    this.router.navigate(['/pages/reading']);
  }
}
