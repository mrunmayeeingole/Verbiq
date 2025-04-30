import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { RouterLink, RouterModule } from '@angular/router';
import { ErrorCorrectionComponent } from './error-correction/error-correction.component';
import { CandidateDetailsComponent } from './candidate-details/candidate-details.component';
import { ClozeComponent } from './cloze/cloze.component';
import { ComphrensionComponent } from './comphrension/comphrension.component';
import { DetailsPageComponent } from './details-page/details-page.component';
import { FinalSubmitComponent } from './final-submit/final-submit.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { LastSubmitComponent } from './last-submit/last-submit.component';
import { MCQUIComponent } from './mcq-ui/mcq-ui.component';
import { PorceedPageComponent } from './porceed-page/porceed-page.component';
import { ReadingUI1Component } from './reading-ui-1/reading-ui-1.component';
import { Speaking1Component } from './speaking-1/speaking-1.component';
import { Speaking2Component } from './speaking-2/speaking-2.component';
import { WritingComponent } from './writing/writing.component';
import { ResultComponent } from './result/result.component';
import { HomePageComponent } from './home-page/home-page.component';
import { JsonTransformPipe } from '../shared/json-transform.pipe';
import { SharedModule } from '../shared/shared.module';
import { InstructionModalComponent } from './instruction-modal/instruction-modal.component';


@NgModule({
  declarations: [
    HomePageComponent,
    
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    RouterModule,
    SharedModule
    // RouterLink
  ],
  exports: [] 
})
export class PagesModule { }
