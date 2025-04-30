import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { SessionService } from '../../shared/session.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CopyProtectionService } from '../../shared/copy.service';

@Component({
  selector: 'app-speaking-1',
  templateUrl: './speaking-1.component.html',
  styleUrl: './speaking-1.component.css'
})
export class Speaking1Component {
  @Input() activeId!: string; 
  @Output() submitEvent = new EventEmitter<void>();
  isPaused = false;
  isPlaying = false;
  isRecording = false;
  recordingComplete = false;
  showRecordingToast = false;
  submittingInProgress = false;
  stream: MediaStream | null = null;
  mediaRecorder: MediaRecorder | null = null;
  audioUrl: string | null = null;
  audioElement: HTMLAudioElement | null = null;
  audioChunks: Blob[] = [];
  audio: HTMLAudioElement | null = null;
  // audioUrl: string | null = null;
  userDetials: any;
  showToast: boolean = false;
  loading: boolean = false;
  questionDetails: any;
  transcription: any;
  languageAssessment: any;
  selectedAnswer: string | null = null;
  isAnswerSelected = false;
  remainingTime: string = '';
  private countdownTime: number = 0;
  private countdownInterval: any;

  constructor(
    private httpService: HttpService, 
    private sessionService: SessionService,
    private http: HttpClient,
    private copyService: CopyProtectionService,
    private elementRef: ElementRef,
    private cdr :  ChangeDetectorRef,
  ) {
    this.userDetials = this.httpService.getUserDetails()?.data;
  }
   
  ngOnInit() {
    this.getNextQuestionsById();  
    this.startCountdown();  
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activeId']) {
      console.log('Selected Type:', this.activeId);
    }
  }

  ngAfterViewInit() {
    this.copyService.applyProtection(this.elementRef);
  }
  
  ngOnDestroy() {
    this.copyService.removeProtection(this.elementRef);
  }



  nextStage(){
    this.submitEvent.emit();
  }

  getNextQuestionsById() {
    if (!this.activeId) {
      console.error('No activeId available');
      return;
    }
    if (!this.userDetials?.language || !this.userDetials?._id) {
      console.error('User details missing');
      return;
    }

    this.loading = true;
    const sessionID = this.sessionService.getSessionID();
    console.log('sessionID', sessionID)

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
          console.log('Ques:', this.questionDetails);
        },
        (error) => {
          console.error('Error fetching data:', error);
          if (error?.error?.message === "No more questions for this type" || error?.error?.status === false) {
            console.log('No more questions available, moving to next stage');
            this.submitEvent.emit();
          }
          this.loading = false;
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
      this.audio.play().catch(err => {
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
        this.getNextQuestionsById();
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
  this.remainingTime = `${this.formatTime(minutes)}:${this.formatTime(seconds)} mins`;
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

  async toggleRecording() {
    if (!this.isRecording) {
      await this.startRecording();
    } else {
      if (this.isPaused) {
        this.resumeRecording();
      } else {
        this.pauseRecording();
      }
    }
  }

  async startRecording() {
    this.audioChunks = [];
    this.releaseAudioUrl();
    this.recordingComplete = false;    
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);      
      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      });      
      this.mediaRecorder.addEventListener('stop', () => {
        this.prepareAudioPreview();
      });      
      this.mediaRecorder.start();
      this.isRecording = true;
      this.isPaused = false;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please ensure you have granted microphone permissions.');
    }
  }

  pauseRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.pause();
      this.isPaused = true;
    }
  }
  
  resumeRecording() {
    if (this.mediaRecorder && this.isRecording && this.isPaused) {
      this.mediaRecorder.resume();
      this.isPaused = false;
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.isPaused = false;
      this.recordingComplete = true;
      this.releaseMediaStream();
    }
  }

  prepareAudioPreview() {
    if (this.audioChunks.length === 0) {
      console.warn('No audio recorded');
      return;
    }
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    this.releaseAudioUrl();
    this.audioUrl = URL.createObjectURL(audioBlob);
    this.audioElement = new Audio(this.audioUrl);    
    this.recordingComplete = true;
  }

  playAudioPreview() {
    if (this.audioElement && this.audioUrl) {
      this.audioElement.play();
      this.isPlaying = true;      
      this.audioElement.onended = () => {
        this.isPlaying = false;
      };
    }
  }

  pauseAudioPreview() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.isPlaying = false;
    }
  }

  releaseMediaStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  releaseAudioUrl() {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }    
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
      this.isPlaying = false;
    }
  }

  async submitRecording() {
    // if (this.submittingInProgress) return;
    // this.submittingInProgress = true;
    this.loading = true;    
    try {
      if (this.isRecording) {
        this.stopRecording();
        await new Promise(resolve => setTimeout(resolve, 500));
      }      
      if (this.audioChunks.length === 0) {
        console.warn('No audio recorded');
        this.showRecordingRequiredToast();
        // this.submittingInProgress = false;
        this.loading = false;
        return;
      }      
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('file', audioBlob, 'speaking.webm');
      formData.append('typeId', this.activeId);
      formData.append('userId', this.userDetials?._id);
      formData.append('questionId', this.questionDetails?._id);      
      const headers = new HttpHeaders({
        'Authorization': 'Bearer your-auth-token',
        'Custom-Header': 'CustomHeaderValue'
      });      
      const response: any = await this.http.post('http://192.168.1.18:8080/upload/audioUpload', formData, { headers }).toPromise();      
      if (response?.data?.transcription) {
        this.transcription = response.data.transcription;
        this.languageAssessment = response.data.language_asesment;
        await this.verifyQuestionAnswer();
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
    } finally {
      this.audioChunks = [];
      this.recordingComplete = false;
      this.releaseAudioUrl();
    }
  }

  onOptionSelect(option: any) {
    this.selectedAnswer = option.optionText;
    this.isAnswerSelected = true;
  }

  verifyQuestionAnswer() {
    this.loading = true;
    return new Promise((resolve, reject) => {
      const sessionID = this.sessionService.getSessionID();
      let answerData;      
      if (this.questionDetails.questionType === 'mcq') {
        answerData = this.selectedAnswer;
      } else {
        answerData = this.transcription;
      }
      let sendData = {
        userId: this.userDetials?._id,
        typeId: this.activeId,
        questionId: this.questionDetails?._id,
        answer: answerData,
        languageAssessmentData: this.questionDetails.questionType === 'text' ? this.languageAssessment : "",
        timeTaken: "30",
        sessionId: sessionID,
        questionType: this.questionDetails?.questionType
      };
      
      this.httpService.post(`mockTestAttempt/submitteQuestionAnswer`, sendData).subscribe(
        (res: any) => {
          this.selectedAnswer = null;
          this.isAnswerSelected = false;
          this.transcription = null;
          this.languageAssessment = null;          
          this.questionDetails = res.data;
          this.getNextQuestionsById();
          resolve(res);
        },
        (error) => {
          this.loading = false;
          this.submittingInProgress = false;
          console.error('Error submitting answer:', error);
          reject(error);
        }
      );
    });
  }

  showRecordingRequiredToast() {
    this.showRecordingToast = true;
    setTimeout(() => {
      this.showRecordingToast = false;
    }, 3000); 
  }
}
