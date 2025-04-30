import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';

@Component({
  selector: 'app-instruction-modal',
  templateUrl: './instruction-modal.component.html',
  styleUrl: './instruction-modal.component.css'
})
export class InstructionModalComponent {
  @Output() modalClosed = new EventEmitter<void>();
  @Input() showModal: boolean = false;
  @Input() stageType: string = '';
  @Input() activeId!: string;
  loading: boolean = false;
  instructionsList: Array<{ title: string; subTitle: string }> = [];
  instructions: { [key: string]: string } = {
    'Reading': 'In this section, you will read passages and answer questions based on them. Read carefully and manage your time well.',
    'Writing': 'In this section, you will write responses to prompts. Focus on clarity, organization, and grammar.',
    'Speaking': 'In this section, you will record your spoken responses to questions. Speak clearly and organize your thoughts.',
    'Listening': 'In this section, you will listen to audio clips and answer questions about them. Pay attention to details and take notes if needed.'
  };
  
  constructor(private httpService : HttpService) { }
  
  ngOnInit(): void {
    console.log('stageType', this.stageType)
    console.log('Selected Type Instruct:', this.activeId);
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['activeId'] && this.activeId) {
      this.getInstructionsByTypeId(this.activeId);
    }
  }

  closeModal(): void {
    this.loading = true;
    this.modalClosed.emit();
    // setTimeout(() => {
    //   this.loading = false;
    //   this.showModal = false;
    // }, 1000);
  }

  getInstructionsByTypeId(typeId: string) {
    this.loading = true;
    this.httpService.getById('instruction/getInstructionById', typeId).subscribe(
      (res: any) => {
        console.log('res@@@@@@@@@@@', res)
        this.loading = false;
        if (res?.data?.instructions?.length) {
          this.instructionsList = res?.data?.instructions;
        }
      },
      (error) => {
        this.loading = false;
        console.error('Error fetching instructions:', error);
      }
    );
  }
  
}
