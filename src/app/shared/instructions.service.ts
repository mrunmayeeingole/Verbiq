// instructions.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructionsService {
  private showModalSubject = new BehaviorSubject<boolean>(false);
  showModal$ = this.showModalSubject.asObservable();

  private stageTypeSubject = new BehaviorSubject<string>('');
  stageType$ = this.stageTypeSubject.asObservable();

  private instructionsSubject = new BehaviorSubject<string>('');
  instructions$ = this.instructionsSubject.asObservable();

  // Instructions content for each stage
  private instructionsContent: { [key: string]: string } = {
    Reading: `
      <h5>Reading Assessment Instructions</h5>
      <p>This section tests your ability to comprehend written text.</p>
      <ul>
        <li>Read the passage or question carefully.</li>
        <li>For multiple-choice questions, select the best answer from the options provided.</li>
        <li>For text questions, you'll need to record your verbal response.</li>
        <li>Pay attention to the timer as you have limited time to complete each question.</li>
        <li>You can bookmark questions to review them later if needed.</li>
      </ul>
      <p>Click "Continue" when you're ready to begin.</p>
    `,
    Writing: `
      <h5>Writing Assessment Instructions</h5>
      <p>This section evaluates your written communication skills.</p>
      <ul>
        <li>Read the writing prompt carefully.</li>
        <li>Type your response in the text area provided.</li>
        <li>Pay attention to grammar, spelling, vocabulary, and organization.</li>
        <li>You'll have a specific time limit for each writing task.</li>
        <li>Your response will be evaluated based on content, structure, and language use.</li>
      </ul>
      <p>Click "Continue" when you're ready to begin.</p>
    `,
    Speaking: `
      <h5>Speaking Assessment Instructions</h5>
      <p>This section assesses your oral communication skills.</p>
      <ul>
        <li>You'll be presented with speaking prompts or questions.</li>
        <li>Use the microphone button to record your response.</li>
        <li>Speak clearly and at a natural pace.</li>
        <li>You can listen to your recording before submitting.</li>
        <li>Your responses will be evaluated on pronunciation, fluency, and content.</li>
      </ul>
      <p>Ensure your microphone is working properly before continuing.</p>
      <p>Click "Continue" when you're ready to begin.</p>
    `,
    Listening: `
      <h5>Listening Assessment Instructions</h5>
      <p>This section evaluates your ability to understand spoken language.</p>
      <ul>
        <li>You'll hear audio recordings or conversations.</li>
        <li>Listen carefully as the audio may only be played once or twice.</li>
        <li>Answer questions based on what you hear.</li>
        <li>For multiple-choice questions, select the best option.</li>
        <li>For open-ended questions, type or record your response.</li>
      </ul>
      <p>Make sure your audio is working properly before continuing.</p>
      <p>Click "Continue" when you're ready to begin.</p>
    `
  };

  constructor() { }

  showInstructions(stageType: string): void {
    this.stageTypeSubject.next(stageType);
    this.instructionsSubject.next(this.instructionsContent[stageType] || '');
    this.showModalSubject.next(true);
  }

  hideModal(): void {
    this.showModalSubject.next(false);
  }

  // Add method to get instructions by stage type
  getInstructions(stageType: string): string {
    return this.instructionsContent[stageType] || '';
  }
}