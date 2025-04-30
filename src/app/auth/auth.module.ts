import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CandidateDetailsComponent } from './candidate-details/candidate-details.component';
import { DetailsPageComponent } from './details-page/details-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  declarations: [
   LoginScreenComponent ,
   CandidateDetailsComponent,
   DetailsPageComponent,
   SignUpComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
