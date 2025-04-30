import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { Router } from '@angular/router';
import * as marked from 'marked';
import { SessionService } from '../../shared/session.service';
import { MediaPermissionsService } from '../../shared/media.service';
import { CopyProtectionService } from '../../shared/copy.service';
interface QuestionOption {
  optionText: string;
  isCorrect: boolean;
  _id: string;
}
interface QuestionDetails {
  _id: string;
  heading: string;
  question: string;
  questionType: string;
  options?: QuestionOption[];
  languageName?: string;
}
@Component({
  selector: 'app-reading-ui-1',
  templateUrl: './reading-ui-1.component.html',
  styleUrl: './reading-ui-1.component.css'
})
export class ReadingUI1Component {
  @ViewChild('videoElement') videoElement!: ElementRef;
  permissionsGranted = false;
  isPaused = false;
  isPlaying = false;
  isRecording = false;
  cameraActive = false;
  loading: boolean = false;
  microphoneActive = false;
  recordingComplete = false;
  showToast: boolean = false;
  submittingInProgress = false;
  isBookmarked: boolean = false;
  isFirstQuestion: boolean = true;
  showRecordingToast: boolean = false; 
  stream: MediaStream | null = null;
  activeStage: string = 'Reading';
  mediaRecorder: MediaRecorder | null = null;
  audioElement: HTMLAudioElement | null = null;
  audioChunks: Blob[] = [];
  timeLeft = 80; 
  timer: any;
  activeId: any;
  nextQues: any;
  typesData: any;
  sessionID: any;
  resDetails: any;
  audioRecive: any;
  userDetials: any;
  transcription: any;
  questionDetails: any;
  languageAssessment: any;
  activeType: string = 'Reading'
  apiError: string = '';
  audio: HTMLAudioElement | null = null;
  audioUrl: string | null = null;
  selectedAnswer: string | null = null;
  isAnswerSelected = false;
  remainingTime: string = '';
  private countdownTime: number = 0;
  private countdownInterval: any;
  instructionText: string = '';
  showInstructionModal: boolean = false;
  nextStageToMove: string = '';

  constructor( private http: HttpClient , private httpService : HttpService , private router :Router , private cdr :  ChangeDetectorRef,   private sessionService: SessionService,    private mediaPermissionsService: MediaPermissionsService,
    private copyService: CopyProtectionService,
    private elementRef: ElementRef,
  ) {
    /* reload code */
    /* document.addEventListener('keydown', function (event) {
      if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
        event.preventDefault();
        alert('Reload is disabled during the exam.');
      }
    });
    window.addEventListener('beforeunload', function (event) {
      event.preventDefault();
      event.returnValue = 'Are you sure you want to leave?';
    }); */
  }

  ngOnInit() {
    this.selectedAnswer = null;
    this.isAnswerSelected = false;
    this.checkPermissions();
    // this.startTimer();
    if(this.activeStage === 'Reading'){
      this.getAllTypes();
    }
    this.userDetials = this.httpService.getUserDetails()?.data;
    this.isBookmarked = localStorage.getItem('bookmark') === 'true';
  }
  
  ngAfterViewInit() {
    this.copyService.applyProtection(this.elementRef);
  }

  ngOnDestroy() {
    this.stopMediaTracks();
    this.stopRecording();
    if (this.timer) {
      clearInterval(this.timer);
    }    
    this.releaseMediaStream();
    this.copyService.removeProtection(this.elementRef);
  }

  goBack(): void {
    this.router.navigate(['/pages/instruction']);
  }
      
  checkPermissions(): void {
    this.mediaPermissionsService.checkPermissionStatus().subscribe(result => {
      this.permissionsGranted = result.camera && result.microphone;
      
      if (this.permissionsGranted) {
        this.initializeCamera();
      }
    });
  }
  
  initializeCamera(): void {
    if (!this.permissionsGranted) {
      return;
    }    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        this.stream = stream;
        this.cameraActive = stream.getVideoTracks().length > 0 && 
                            stream.getVideoTracks()[0].enabled;
        this.microphoneActive = stream.getAudioTracks().length > 0 && 
                               stream.getAudioTracks()[0].enabled;
        setTimeout(() => {
          if (this.videoElement && this.videoElement.nativeElement) {
            this.videoElement.nativeElement.srcObject = stream;
          }
        }, 0);
      })
      .catch(error => {
        console.error('Error accessing media devices:', error);
        this.permissionsGranted = false;
      });
  }
   
  stopMediaTracks(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  } 

  getAllTypes() { 
    this.loading = true;
    this.apiError = '';
    this.httpService.get('types/getAllTypes').subscribe(
      (res: any) => {
        this.typesData = res.data;
        console.log('Types:', this.typesData);
        if (this.typesData.length > 0) {
          const firstType = this.typesData[0]; 
          this.setActiveType(firstType.typeName, firstType._id);
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.apiError = 'Unable to load Data. Please try again later.'; 
        console.error('Error fetching data:', error);
      }
    );
  }
  
  setActiveType(typeName: string, typeId: string) {
    console.log('typeName', typeName)
    // if (this.activeStage !== typeName) {
      this.activeStage = typeName;
      this.activeType = typeName;
      this.activeId = typeId;     
    // }
    if (typeName === 'Reading') {
      this.getNextQuestionsById();
    }
  }

  getNextQuestionsById() {  
    this.loading = true;
    this.httpService.get(`questions/getTestQuestionsById/${this.activeId}/${this.userDetials?.language}/${this.userDetials?._id}`).subscribe(
      (res: any) => {     
        this.questionDetails = res.data;
        this.resDetails = res;
        this.processQuestionResponse(res);
        this.loading = false;
        if (res?.sessionId?._id) {
          this.sessionService.setSessionID(res.sessionId._id);
        }
        if (res?.isBookmarked) {
          this.isBookmarked = true;
        } else {
          this.isBookmarked = false;
        }
        console.log('Question Details:', this.questionDetails);
        if (res?.ttsResponse?.audio_files?.length) {
          // this.audioUrl = `https://torytal.com/uploads/Soundbyte_Eng_L1.mp3`; // Update with actual path
          this.audioUrl = res?.ttsResponse?.audio_files; // Update with actual path
          this.playTTS(); // auto play
        }
        this.isFirstQuestion = false;
        this.resetCountdown();
      },
      (error) => {
        this.loading = false;
        console.error('Error fetching data:', error);
        if (error?.error?.message === "No more new questions available.") {
          console.log('No more questions available, moving to next stage');
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
      this.audio.play().catch(err => {
        console.warn('Audio playback failed:', err);
      });
    }
  }
  
  getNextQuestionsById2() {  
    const sessionID = this.sessionService.getSessionID();
    this.httpService.get(`questions/getNextQuestionsById2/${this.activeId}/${this.userDetials?.language}/${this.userDetials?._id}/${sessionID}`).subscribe(
      (res: any) => {
        this.questionDetails = res.data;
        this.processQuestionResponse(res);
        this.nextQues = res.data;
        if (res?.isBookmarked) {
          this.isBookmarked = true;
        } else {
          this.isBookmarked = false;
        }
        console.log('Next Question Details:', this.nextQues);
        this.resetCountdown();
        this.loading = false;
        this.submittingInProgress = false;
      },
      async (error) => {
        console.error('Error fetching data:', error);
        if (error?.error?.message === "No more questions for this type" || error?.error?.message === false) {
          console.log('No more questions available, moving to next stage');
          await this.moveToNextStage();
        }
        this.loading = false;
        this.submittingInProgress = false;
      }
    );
  }

  async loadNextQuestion() {
    if (this.submittingInProgress) return;    
    try {
      await this.submitRecording();
    } catch (error) {
      console.error('Error in submission sequence:', error);
    }
  }

  resetCountdown() {
    this.updateTimeDisplay();
    clearInterval(this.timer);
    this.startCountdown();
    this.showToast = false;
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
 
  async submitRecording() {
    if (this.submittingInProgress) return;
    this.submittingInProgress = true;
    this.loading = true;    
    try {
      if (this.isRecording) {
        this.stopRecording();
        await new Promise(resolve => setTimeout(resolve, 500));
      }      
      if (this.audioChunks.length === 0) {
        console.warn('No audio recorded');
        this.showRecordingRequiredToast();
        this.submittingInProgress = false;
        this.loading = false;
        return;
      }      
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('file', audioBlob, 'reading.webm');
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
      } else {
        console.warn('No transcription received in the response');
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
    } finally {
      this.audioChunks = [];
      this.recordingComplete = false;
      this.releaseAudioUrl();
    }
  }

  verifyQuestionAnswer() {
    this.loading = true;
    return new Promise((resolve, reject) => {
      const sessionID = this.sessionService.getSessionID();
      let answerToSend = this.questionDetails?.questionType === 'mcq' ? this.selectedAnswer : this.transcription;
      let sendData = {
        userId: this.userDetials?._id,
        typeId: this.activeId,
        questionId: this.questionDetails?._id,
        answer: answerToSend,
        languageAssessmentData: this.languageAssessment,
        timeTaken: "30",
        sessionId: sessionID,
        questionType  :  this.questionDetails?.questionType
      };      
      this.httpService.post(`mockTestAttempt/submitteQuestionAnswer`, sendData).subscribe(
        (res: any) => {
          this.questionDetails = res.data;
          // this.transcription = "";
          this.selectedAnswer = null;
          this.isAnswerSelected = false;
          
          this.getNextQuestionsById2();
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

  onOptionSelect(option: any) {
    this.selectedAnswer = option.optionText;
    this.isAnswerSelected = true;
  }

  showRecordingRequiredToast() {
    this.showRecordingToast = true;
    this.cdr.detectChanges(); 
    setTimeout(() => {
      this.showRecordingToast = false;
      this.cdr.detectChanges();
    }, 3000);
  }


  async prepareToMoveNextStage() {
    const stages = ['Reading', 'Writing', 'Speaking', 'Listening'];
    const currentIndex = stages.indexOf(this.activeStage);
    
    if (currentIndex < stages.length - 1) {
      this.nextStageToMove = stages[currentIndex + 1];
      this.showInstructionModal = true;
    } else {
      this.nextStageToMove = stages[0]; // Loop back to first stage
      this.showInstructionModal = true;
    }
  }
  
  async moveToNextStage() {
    if (this.showInstructionModal) {
      // If we're already showing the modal, don't proceed
      return;
    }
    
    const stages = ['Reading', 'Writing', 'Speaking', 'Listening'];
    const currentIndex = stages.indexOf(this.activeStage);
    
    if (currentIndex < stages.length - 1) {
      this.nextStageToMove = stages[currentIndex + 1];
      this.showInstructionModal = true;
    } else {
      this.nextStageToMove = stages[0];
      this.showInstructionModal = true;
    }
  }
  
  onModalClosed() {
    this.loading = true;
    this.showInstructionModal = false;
    this.activeStage = this.nextStageToMove;
    this.activeType = this.activeStage;    
    const nextType = this.typesData.find((type: any) => type.typeName === this.activeStage);
    if (nextType) {
      this.activeId = nextType._id;
    }
    this.nextStageToMove = '';
    this.loading = false;
  }

    // async moveToNextStage() {
    //   const stages = ['Reading', 'Writing', 'Speaking', 'Listening'];
    //   const currentIndex = stages.indexOf(this.activeStage);      
    //   if (currentIndex < stages.length - 1) {
    //     this.activeStage = stages[currentIndex + 1];
    //     this.activeType = this.activeStage;        
    //     const nextType = this.typesData.find((type: any) => type.typeName === this.activeStage);
    //     if (nextType) {
    //       this.activeId = nextType._id;
    //     }
    //   } else {
    //     this.activeStage = stages[0];
    //   }
    // }

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
      console.log('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please ensure you have granted microphone permissions.');
    }
  }

  pauseRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.pause();
      this.isPaused = true;
      console.log('Recording paused');
    }
  }

  resumeRecording() {
    if (this.mediaRecorder && this.isRecording && this.isPaused) {
      this.mediaRecorder.resume();
      this.isPaused = false;
      console.log('Recording resumed');
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.isPaused = false;
      this.recordingComplete = true;
      console.log('Recording stopped');
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
    console.log('Audio preview ready');
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

  downloadAudio() {
    if (this.audioChunks.length === 0) {
      alert('No audio recorded yet');
      return;
    }
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  toggleBookmark() {  
    let sendData = {
      userId: this.userDetials?._id,
      typeId: this.activeId,
      questionId: this.questionDetails?._id,
    };
  
    this.httpService.post(`questionBookMark/createQuestionBookMark`, sendData).subscribe(
      (res: any) => {
        this.loading = false;        
        if (res?.success) {
          this.isBookmarked = !this.isBookmarked;
        }
      },
      (error) => {
        this.loading = false;
        console.error('Error:', error);
      }
    );
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
        this.getNextQuestionsById2();
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
}
