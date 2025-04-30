import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterModule } from '@angular/router';
import { CandidateDetailsComponent } from './pages/candidate-details/candidate-details.component';
import { ClozeComponent } from './pages/cloze/cloze.component';
import { ComphrensionComponent } from './pages/comphrension/comphrension.component';
import { DetailsPageComponent } from './pages/details-page/details-page.component';
import { ErrorCorrectionComponent } from './pages/error-correction/error-correction.component';
import { FinalSubmitComponent } from './pages/final-submit/final-submit.component';
import { InstructionsComponent } from './pages/instructions/instructions.component';
import { LastSubmitComponent } from './pages/last-submit/last-submit.component';
import { MCQUIComponent } from './pages/mcq-ui/mcq-ui.component';
import { PorceedPageComponent } from './pages/porceed-page/porceed-page.component';
import { ReadingUI1Component } from './pages/reading-ui-1/reading-ui-1.component';
import { Speaking1Component } from './pages/speaking-1/speaking-1.component';
import { Speaking2Component } from './pages/speaking-2/speaking-2.component';
import { WritingComponent } from './pages/writing/writing.component';
import { ResultComponent } from './pages/result/result.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MobileRestrictedComponent } from './components/mobile-restricted/mobile-restricted.component';
import { PreventRightClickDirective } from './shared/prevent-right-click.directive';
import { InstructionModalComponent } from './pages/instruction-modal/instruction-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    CandidateDetailsComponent,
    DetailsPageComponent,
    PorceedPageComponent,
    InstructionsComponent,
    ReadingUI1Component,
    WritingComponent,
    Speaking1Component,
    Speaking2Component,
    LastSubmitComponent,
    FinalSubmitComponent,
    MCQUIComponent,
    ClozeComponent,
    ComphrensionComponent,
    ErrorCorrectionComponent,
    ResultComponent,
    LoaderComponent,
    MobileRestrictedComponent,
    PreventRightClickDirective,
    InstructionModalComponent 
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
