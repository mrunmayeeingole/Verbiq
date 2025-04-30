import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructionsComponent } from './instructions/instructions.component';
import { CandidateDetailsComponent } from './candidate-details/candidate-details.component';
import { ClozeComponent } from './cloze/cloze.component';
import { ComphrensionComponent } from './comphrension/comphrension.component';
import { DetailsPageComponent } from './details-page/details-page.component';
import { ErrorCorrectionComponent } from './error-correction/error-correction.component';
import { FinalSubmitComponent } from './final-submit/final-submit.component';
import { LastSubmitComponent } from './last-submit/last-submit.component';
import { MCQUIComponent } from './mcq-ui/mcq-ui.component';
import { PorceedPageComponent } from './porceed-page/porceed-page.component';
import { ReadingUI1Component } from './reading-ui-1/reading-ui-1.component';
import { Speaking1Component } from './speaking-1/speaking-1.component';
import { Speaking2Component } from './speaking-2/speaking-2.component';
import { WritingComponent } from './writing/writing.component';
import { ResultComponent } from './result/result.component';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  {
    path: "",
    // loadChildren: () => import('./pages.module').then(m => m.PagesModule),
    children: [
      {
        path: "",
        redirectTo: "proceed",
        pathMatch: "full",
      },
     
  // { path: 'login', component: LoginScreenComponent },
  { path: 'can-data', component: CandidateDetailsComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'data-page', component: DetailsPageComponent },
  { path: 'proceed', component: PorceedPageComponent },
  { path: 'instruction', component: InstructionsComponent },
  { path: 'reading', component: ReadingUI1Component },
  { path: 'wirting', component: WritingComponent },
  { path: 'speak-1', component: Speaking1Component },
  { path: 'speak-2', component: Speaking2Component },
  { path: 'submit', component: LastSubmitComponent },
  { path: 'final-submit', component: FinalSubmitComponent },
  { path: 'mcq-ui', component: MCQUIComponent },
  { path: 'cloze', component: ClozeComponent },
  { path: 'compher', component: ComphrensionComponent },
  { path: 'error', component: ErrorCorrectionComponent },
  { path: 'result', component: ResultComponent },
     
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
