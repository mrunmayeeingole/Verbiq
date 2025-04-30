import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, SimpleChanges,} from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { SessionService } from '../../shared/session.service';
import { CopyProtectionService } from '../../shared/copy.service';
declare var keyman: any;
@Component({
  selector: 'app-writing',
  templateUrl: './writing.component.html',
  styleUrl: './writing.component.css',
})

export class WritingComponent {
  @Input() activeId!: string;
  @Output() submitEvent = new EventEmitter<void>();
  private countdownTime: number = 0;
  private countdownInterval: any;
  selectedAnswer: string | null = null;
  stages = ['Reading', 'Writing', 'Speaking', 'Listening'];
  audio: HTMLAudioElement | null = null;
  audioUrl: string | null = null;
  showToast: boolean = false;
  remainingTime: string = '';
  userDetials: any;
  loading: boolean = false;
  questionDetails: any;
  currentStageIndex = 0;
  activeStage = this.stages[this.currentStageIndex];
  answerText: string = '';
  isAnswerSelected = false;
  evaluation: any;
  timer: any;
  showInstructionModal: boolean = false;
  constructor(
    private httpService: HttpService,
    private sessionService: SessionService,
    private cdr: ChangeDetectorRef,
    private copyService: CopyProtectionService,
    private elementRef: ElementRef,
  ) {
    this.userDetials = this.httpService.getUserDetails()?.data;
    console.log('this.userDetials', this.userDetials);
  }

  ngOnInit() {
   /*  this.checkKeyman();
    setTimeout(() => {
      if ((window as any).keyman) {
        keyman.setControl('KeymanWebControl'); // Link the UI to the div
      }
    }, 1000); */
  
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
  
  ngAfterViewInit() {
    // this.loadKeymanScript();
    // window.addEventListener('load', () => {
    //   console.log('🌐 Window loaded. Now checking Keyman...');
    //   this.checkKeyman(); // Will retry until loaded
    // });
    // this.copyService.applyProtection(this.elementRef);
  }
  
/*   checkKeyman() {
    const keyman = (window as any).keyman;
  
    if (keyman) {
      console.log('✅ Keyman is available. Initializing...');
      this.initializeKeyman();
    } else {
      console.warn('⏳ Keyman is not loaded yet. Retrying...');
      setTimeout(() => this.checkKeyman(), 500);
    }
  }
  
  loadKeyman() {
    const interval = setInterval(() => {
      if ((window as any).keyman) {
        clearInterval(interval);
        console.log('Keyman initialized.');
        this.initializeKeyman();
      }
    }, 100);  // Retry every 100ms to check if Keyman is available
  }
  
  initializeKeyman() {
    const keyman = (window as any).keyman;
  
    keyman.init({
      attachType: 'auto',
      ui: 'button'
    });
  
    // Add multiple keyboards
    keyman.addKeyboards('us', 'french', 'spanish', 'german', 'italian');
  
    // Attach to the textarea
    const input = document.getElementById('keymanInput');
    if (input) {
      keyman.setActiveElement(input); // This is better than attach()
    }
  }

  loadKeymanScript() {
    const script = document.createElement('script');
    script.src = 'https://s.keyman.com/kmw/engine/16.0.144/keymanweb.js';  // ✅ Reliable source
    script.async = true;
    script.onload = () => {
      console.log('✅ Keyman script loaded!');
      this.checkKeyman();
    };
    script.onerror = () => console.error('❌ Failed to load Keyman script.');
    document.head.appendChild(script);
  }
  
  
  onKeyboardChange(event: any) {
    const selectedKeyboard = event.target.value;
    const keyman = (window as any).keyman;
  
    if (keyman) {
      try {
        keyman.addKeyboards(selectedKeyboard); // Add if not loaded
        keyman.setActiveKeyboard(selectedKeyboard); // ✅ Correct method
        console.log('Activated keyboard:', selectedKeyboard);
      } catch (error) {
        console.error('Error switching keyboards:', error);
      }
    } else {
      console.error('Keyman is not loaded.');
    }
  } */
  
  

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    // this.copyService.removeProtection(this.elementRef);
  }

  resetCountdown() {
    this.updateTimeDisplay();
    clearInterval(this.timer);
    this.startCountdown();
    this.showToast = false;
  }

  getNextQuestionsById() {
    this.loading = true;
    if (!this.activeId) {
      console.error('No activeId available');
      return;
    }
    if (!this.userDetials?.language || !this.userDetials?._id) {
      console.error('User details missing');
      return;
    }
    // this.loading = true;
    const sessionID = this.sessionService.getSessionID();
    console.log('sessionID', sessionID);
    this.httpService
      .get(
        `questions/getNextQuestionsById2/${this.activeId}/${this.userDetials?.language}/${this.userDetials?._id}/${sessionID}`
      )
      .subscribe(
        (res: any) => {
          this.questionDetails = res.data;
          this.processQuestionResponse(res);
          if (res?.ttsResponse?.audio_files?.length) {
            // this.audioUrl = `https://torytal.com/uploads/Soundbyte_Eng_L1.mp3`;
            this.audioUrl = res?.ttsResponse?.audio_files;
            this.playTTS();
          }
          this.resetCountdown();
          console.log('Ques:', this.questionDetails);
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching data:', error);
          if (
            error?.error?.message === 'No more questions for this type' ||
            error?.error?.status === false
          ) {
            console.log('No more questions available, moving to next stage');
            // this.showInstructionModal = true;
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
    this.countdownInterval = setInterval(async () => {
      if (this.countdownTime <= 0) {
        clearInterval(this.countdownInterval);
        // await this.sendEvaluationRequest();
        await  this.verifyQuestionAnswer();
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
      let sendData = {
        Question: this.questionDetails?.question,
        response: answerToSend,       
      };
      this.httpService
        .post(`mockTestAttempt/sendEvaluationRequest`, sendData)
        .subscribe(
          (res: any) => {
            this.evaluation = res.evaluation;
            resolve(res);
          },
          (error) => {
            console.error('Error submitting answer:', error);
            reject(error);
          }
        );
    });
  }
  disableCopy(event: Event) {
    event.preventDefault();
  }

  async verifyQuestion() {
    if (this.questionDetails?.questionType === 'mcq') {
      this.verifyQuestionAnswer();
    } else {
      await this.sendEvaluationRequest();
      this.verifyQuestionAnswer();
    }
  }

  verifyQuestionAnswer() {
    this.loading = true;
    return new Promise((resolve, reject) => {
      const sessionID = this.sessionService.getSessionID();
      const isMCQ = this.questionDetails?.questionType === 'mcq';

      let answerToSend = isMCQ ? this.selectedAnswer : this.answerText;
  
      // Build base payload
      let sendData: any = {
        userId: this.userDetials?._id,
        typeId: this.activeId,
        questionId: this.questionDetails?._id,
        answer: answerToSend || "",
        timeTaken: '30',
        sessionId: sessionID,
        questionType: this.questionDetails?.questionType,
      };
  
      // Add languageAssessmentData only for non-MCQ
      if (!isMCQ) {
        sendData.languageAssessmentData = this.evaluation;
      }
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
          async (error) => {
         await   this.getNextQuestionsById();
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

  nextStage() {
    this.submitEvent.emit();
  }
}
