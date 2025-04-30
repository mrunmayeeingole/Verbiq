import {  Component,  EventEmitter,  Input,  Output,  SimpleChanges,  OnDestroy,  ViewChild,  ElementRef,  ChangeDetectorRef,} from '@angular/core';
import { MediaRecordingService } from '../../shared/media-manager.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MediaPermissionsService } from '../../shared/media.service';
import { CopyProtectionService } from '../../shared/copy.service';
import { SessionService } from '../../shared/session.service';
import { HttpService } from '../../shared/http/http.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-speaking-2',
  templateUrl: './speaking-2.component.html',
  styleUrl: './speaking-2.component.css',
})
export class Speaking2Component implements OnDestroy {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @Output() submitEvent = new EventEmitter<void>();
  @Input() activeId!: string;
  sanitizedAudioUrl: SafeResourceUrl = '';
  selectedAnswer: string | null = null;
  videoPreviewUrl: string | null = null;
  recordedVideoBlob: Blob | null = null;
  audio: HTMLAudioElement | null = null;
  recordingCheckInterval: any = null;
  videoLink: string | null = null;
  audioUrl: string | null = null;
  isRecording: boolean = false;
  showPreview: boolean = false;
  showToast: boolean = false;
  isAnswerSelected = false;
  loading: boolean = false;
  answerText: string = '';
  remainingTime: string = '';
  recordingDuration: number = 0;
  private countdownTime: number = 0;
  private countdownInterval: any;
  questionDetails: any;
  userDetials: any;
  evaluation: any;

  constructor(
    private httpService: HttpService,
    private http: HttpClient,
    private sessionService: SessionService,
    private router: Router,
    private mediaPermissionsService: MediaPermissionsService,
    private mediaRecordingService: MediaRecordingService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private copyService: CopyProtectionService,
    private elementRef: ElementRef
  ) {
    this.userDetials = this.httpService.getUserDetails()?.data;
    this.getNextQuestionsById();
    this.sanitizedAudioUrl = this.questionDetails?.question;
  }

  ngOnInit() {
    this.initializeRecording();
    this.mediaRecordingService.isRecording$.subscribe((isRecording) => {
      this.isRecording = isRecording;
      if (isRecording && !this.recordingCheckInterval) {
        this.recordingCheckInterval = setInterval(() => {
          this.recordingDuration++;
          if (this.recordingDuration % 30 === 0) {
            this.checkRecordingStatus();
          }
        }, 1000);
      } else if (!isRecording && this.recordingCheckInterval) {
        clearInterval(this.recordingCheckInterval);
        this.recordingCheckInterval = null;
        this.recordingDuration = 0;
        this.saveRecordedVideo();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['activeId'] &&
      changes['activeId'].currentValue &&
      (!this.questionDetails ||
        this.questionDetails._id !== changes['activeId'].currentValue)
    ) {
      console.log('Selected Type:', this.activeId);
      this.getNextQuestionsById();
    }
  }

  ngOnDestroy() {
    this.stopRecording();
    this.stopAndReleaseMedia();
    if (this.recordingCheckInterval) {
      clearInterval(this.recordingCheckInterval);
      this.recordingCheckInterval = null;
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval); 
      this.countdownInterval = null;
    }
    this.cleanupVideoResources();
    this.copyService.removeProtection(this.elementRef);
  }
  
  private cleanupVideoResources() {
    if (this.videoPreviewUrl) {
      URL.revokeObjectURL(this.videoPreviewUrl);
      this.videoPreviewUrl = null;
    }
    if (this.videoLink) {
      URL.revokeObjectURL(this.videoLink);
      this.videoLink = null;
    }
  }

  private initializeRecording() {
    if (!this.isRecording) {
      this.startRecording();
    }
  }

  ngAfterViewInit() {
    this.copyService.applyProtection(this.elementRef);
  }

  playAudio() {
    if (!this.sanitizedAudioUrl) {
      console.error('Audio URL is not available yet!');
      return;
    }
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      this.audioPlayer.nativeElement.load(); // Reload audio before playing
      this.audioPlayer.nativeElement
        .play()
        .then(() => console.log('Audio is playing'))
        .catch((error: any) => console.error('Audio play error:', error));
    } else {
      console.error('Audio element is not initialized yet.');
    }
  }

  private startRecording() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log('Camera and microphone access granted for recording.');
        this.mediaRecordingService.startRecording().then((success) => {
          if (success) {
            console.log('Recording started successfully');
            setTimeout(() => this.checkRecordingStatus(), 3000);
          } else {
            console.error('Failed to start recording');
            this.showRecordingError(
              'Failed to start recording. Please refresh and try again.'
            );
          }
        });
      })
      .catch((error) => {
        console.error('Permission denied for recording:', error);
        this.showRecordingError(
          'Camera and microphone access denied. Please enable permissions and try again.'
        );
      });
  }

  checkRecordingStatus() {
    if (!this.isRecording) {
      this.showRecordingError(
        'Recording has stopped unexpectedly. Please refresh and try again.'
      );
      return false;
    }
    const currentBlob = this.mediaRecordingService.getCurrentRecordingBlob();
    if (!currentBlob || currentBlob.size === 0) {
      this.showRecordingError(
        'Recording appears to be empty. Please refresh and try again.'
      );
      return false;
    }
    this.recordedVideoBlob = currentBlob;
    console.log('Recording check: OK, size:', currentBlob.size, 'bytes');
    return true;
  }

  saveRecordedVideo() {
    const finalBlob =
      this.mediaRecordingService.getCurrentRecordingBlob() ||
      this.recordedVideoBlob;
    if (finalBlob && finalBlob.size > 0) {
      this.recordedVideoBlob = finalBlob;
      console.log('Video saved, size:', this.recordedVideoBlob.size, 'bytes');
      this.createVideoLink();
      this.storeVideoLocally();
    } else {
      console.error('No video data to save');
    }
  }

  storeVideoLocally() {
    if (!this.recordedVideoBlob) {
      console.error('No video blob to store');
      return;
    }
    const sessionID = this.sessionService.getSessionID();
    const userId = this.userDetials?._id;
    const videoKey = `exam-video-${userId}-${sessionID}`;
    sessionStorage.setItem('currentVideoKey', videoKey);
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      this.storeInIndexedDB(videoKey, arrayBuffer);
    };
    reader.readAsArrayBuffer(this.recordedVideoBlob);
  }

  storeInIndexedDB(key: string, data: any) {
    const request = indexedDB.open('VideoStorage', 1);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos');
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['videos'], 'readwrite');
      const store = transaction.objectStore('videos');
      store.put(data, key);
      transaction.oncomplete = () => {
        console.log(`Video stored successfully with key: ${key}`);
      };
      transaction.onerror = (error) => {
        console.error('Error storing video:', error);
      };
    };
    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
    };
  }

  createVideoLink() {
    if (!this.recordedVideoBlob) {
      console.error('No video blob available to create link');
      return;
    }
    if (this.videoLink) {
      URL.revokeObjectURL(this.videoLink);
    }
    this.videoLink = URL.createObjectURL(this.recordedVideoBlob);
    console.log('Video link created:', this.videoLink);
    console.log('Video blob size:', this.recordedVideoBlob.size, 'bytes');
    console.log('Video blob type:', this.recordedVideoBlob.type);
    return this.videoLink;
  }

  showRecordingError(message: string) {
    console.error('Recording error:', message);
    alert('Recording error: ' + message);
  }

  generateVideoPreview() {
    if (!this.recordedVideoBlob || this.recordedVideoBlob.size === 0) {
      this.showRecordingError('No video data available for preview.');
      return;
    }
    if (this.videoPreviewUrl) {
      URL.revokeObjectURL(this.videoPreviewUrl);
    }
    this.videoPreviewUrl = URL.createObjectURL(this.recordedVideoBlob);
    this.showPreview = true;
  }

  closeVideoPreview() {
    this.showPreview = false;
  }

  getRecordedVideo(): Blob | null {
    return this.recordedVideoBlob;
  }

  checkVideo() {
    let videoBlob = this.recordedVideoBlob;
    if (!videoBlob) {
      videoBlob = this.mediaRecordingService.getCurrentRecordingBlob();
    }
    if (!videoBlob) {
      const videoKey = sessionStorage.getItem('currentVideoKey');
      if (videoKey) {
        this.retrieveVideoFromIndexedDB(videoKey).then((blob) => {
          if (blob) {
            this.recordedVideoBlob = blob;
            this.createVideoLink();
            this.generateVideoPreview();
          } else {
            this.showRecordingError('No video has been recorded yet');
          }
        });
        return null;
      } else {
        console.log('No video recorded yet');
        alert('No video has been recorded yet');
        return null;
      }
    }
    console.log('Video blob available:', videoBlob);
    console.log('Video size:', videoBlob.size, 'bytes');
    console.log('Video type:', videoBlob.type);
    const link = this.createVideoLink();
    console.log('Access video at:', link);
    this.generateVideoPreview();
    return videoBlob;
  }

  retrieveVideoFromIndexedDB(key: string): Promise<Blob | null> {
    return new Promise((resolve) => {
      const request = indexedDB.open('VideoStorage', 1);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['videos'], 'readonly');
        const store = transaction.objectStore('videos');
        const getRequest = store.get(key);
        getRequest.onsuccess = () => {
          if (getRequest.result) {
            const blob = new Blob([getRequest.result], { type: 'video/webm' });
            resolve(blob);
          } else {
            resolve(null);
          }
        };
        getRequest.onerror = () => {
          console.error('Error retrieving video from IndexedDB');
          resolve(null);
        };
      };
      request.onerror = () => {
        console.error('Error opening IndexedDB');
        resolve(null);
      };
    });
  }

  private stopRecording() {
    if (this.isRecording) {
      const recordedBlob = this.mediaRecordingService.stopRecording();
      if (recordedBlob) {
        console.log('Recording stopped, size:', recordedBlob.size);
        this.recordedVideoBlob = recordedBlob;
        this.createVideoLink();
        this.storeVideoLocally();
      }
    }
  }

  private stopAndReleaseMedia() {
    console.log('Stopping and releasing all media streams');
    this.mediaPermissionsService.stopMediaTracks();
    this.mediaRecordingService.releaseMediaResources();
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: false })
      .then(() => console.log('Reset media permissions'))
      .catch(() => console.log('Attempted to reset media permissions'));
  }

  onOptionSelect(option: any) {
    this.selectedAnswer = option.optionText;
    this.isAnswerSelected = true;
  }

  async verifyQuestion() {
    await this.sendEvaluationRequest();
   
  }

  verifyQuestionAnswer() {
    this.loading = true;
    return new Promise((resolve, reject) => {
      const sessionID = this.sessionService.getSessionID();
      let answerToSend =
        this.questionDetails?.questionType === 'mcq'
          ? this.selectedAnswer
          : this.answerText;
      let sendData = {
        userId: this.userDetials?._id,
        typeId: this.activeId,
        questionId: this.questionDetails?._id,
        answer: answerToSend,
        languageAssessmentData: '',
        timeTaken: '30',
        sessionId: sessionID,
        questionType: this.questionDetails?.questionType,
      };
      this.httpService
        .post(`mockTestAttempt/submitteQuestionAnswer`, sendData)
        .subscribe(
          (res: any) => {
            this.answerText = '';
            this.selectedAnswer = null;
            this.isAnswerSelected = false;
            this.questionDetails = res.data;
            this.getNextQuestionsById();
            resolve(res);
          },
          (error) => {
            this.loading = false;
            console.error('Error submitting answer:', error);
            reject(error);
          }
        );
    });
  }

  getNextQuestionsById() {
    if (
      !this.activeId ||
      !this.userDetials?.language ||
      !this.userDetials?._id
    ) {
      console.error('Required data missing');
      return;
    }
    this.loading = true;
    const sessionID = this.sessionService.getSessionID();
    this.httpService
      .get(
        `questions/getNextQuestionsById2/${this.activeId}/${this.userDetials?.language}/${this.userDetials?._id}/${sessionID}`
      )
      .subscribe(
        (res: any) => {
          this.loading = false;
          this.questionDetails = res.data;
          this.processQuestionResponse(res);
          if (res?.ttsResponse?.audio_files?.length) {
            // this.audioUrl = `https://torytal.com/uploads/Soundbyte_Eng_L1.mp3`;
            this.audioUrl = res?.ttsResponse?.audio_files;
            this.playTTS();
          }
          // if (this.questionDetails?.question) {
            const audioUrl = this.questionDetails.question;
            // const audioUrl =
            //   'https://file-examples.com/storage/fe2465184067ef97996fb41/2017/11/file_example_WAV_1MG.wav';
            // const extension = audioUrl.split('.').pop()?.toLowerCase();
            this.sanitizedAudioUrl =
              this.sanitizer.bypassSecurityTrustUrl(audioUrl);

            // if (extension === 'mp3' || extension === 'wav') {
              // this.sanitizedAudioUrl =
              //   this.sanitizer.bypassSecurityTrustUrl(audioUrl);
              // console.log('Updated Audio URL:', this.sanitizedAudioUrl);
            // } else {
              // console.error(`Unsupported audio format: .${extension}`);
              // this.sanitizedAudioUrl = '';
            // }
          // } else {
            console.error('Audio URL is missing in API response!');
          // }
          this.cdr.detectChanges();
          console.log('Question:', this.questionDetails);
        },
        (error) => {
          this.loading = false;
          console.error('Error fetching data:', error);
          if (
            error?.error?.message === 'No more questions for this type' ||
            error?.error?.status === false
          ) 
          if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
          }
          {
            console.log('No more questions available, moving to next stage');
            this.router.navigate(['/pages/submit']);
            this.stopRecording();
            this.stopAndReleaseMedia();
          }
        }
      );
  }

  playTTS() {
    if (this.audioUrl) {
      if (this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0;
      }
      this.audio = new Audio(this.audioUrl);
      this.audio.play().catch((err) => {
        console.warn('Audio playback failed:', err);
      });
    }
  }

  processQuestionResponse(response: any) {
    this.questionDetails = response.data;
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    console.log('Question time from API:', response.questionTime);
    this.countdownTime = response.questionTime * 60;
    console.log('Countdown time set to:', this.countdownTime);
    this.updateTimeDisplay();
    console.log('Remaining time string:', this.remainingTime);
    this.startCountdown();
  }

  startCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  
    this.countdownInterval = setInterval(() => {
      if (this.countdownTime <= 0) {
        clearInterval(this.countdownInterval);
  
        Swal.fire({
          title: 'Time’s up!',
          text: 'Your time is over. Click OK to submit.',
          icon: 'warning',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            if (this.countdownInterval) {
              clearInterval(this.countdownInterval);
              this.countdownInterval = null;
            }
            this.router.navigate(['/pages/submit']);
          }
        });
  
        return;
      }
  
      this.countdownTime--;
      this.updateTimeDisplay();
  
      if (this.countdownTime === 60) {
        this.showToastMessage();
      }
    }, 1000);
  }

  updateTimeDisplay() {
    const minutes = Math.floor(this.countdownTime / 60);
    const seconds = this.countdownTime % 60;
    this.remainingTime = `${this.formatTime(minutes)}:${this.formatTime(
      seconds
    )} mins`;
    this.cdr.markForCheck();
  }

  formatTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }

  showToastMessage() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }

  sendEvaluationRequest() {
    this.loading = true;
  return new Promise((resolve, reject) => {
    const sessionID = this.sessionService.getSessionID();
    let answerToSend =
      this.questionDetails?.questionType === 'mcq'
        ? this.selectedAnswer
        : this.answerText;

    // Create FormData
    let formData = new FormData();
    formData.append('audio_url', this.questionDetails?.question || '');
    formData.append('user_text', answerToSend || '');
      this.http
        .post(`
http://192.168.1.18:8080/mockTestAttempt/sendAnalyzeEvaluationRequest`, formData)
        .subscribe(
          (res: any) => {
            this.evaluation = res.evaluation;
            this.verifyQuestionAnswer();
            resolve(res);
          },
          (error) => {
            console.error('Error submitting answer:', error);
            reject(error);
          }
        );
    });
  }
}
