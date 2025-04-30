import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { CandidateDetailsComponent } from './candidate-details/candidate-details.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DetailsPageComponent } from './details-page/details-page.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    component : LoginScreenComponent
  },
  {
    path: "sign-up",
    component : SignUpComponent
  },
  {
    path: "can-data",
    component : CandidateDetailsComponent
  },
  { 
    path: 'data-page',
    component: DetailsPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
