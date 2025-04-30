import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../shared/http/http.service';
import { SessionService } from '../../shared/session.service';

@Component({
  selector: 'app-last-submit',
  templateUrl: './last-submit.component.html',
  styleUrl: './last-submit.component.css'
})
export class LastSubmitComponent {
  loading: boolean = false;
  userDetials: any;
  submitDetails: any;


  constructor(
    private route: ActivatedRoute ,
     private sessionService: SessionService ,
      private httpService: HttpService,
      private router: Router
    ) {}

ngOnInit() {

  this.userDetials = this.httpService.getUserDetails()?.data;
  this.getSessionById();
}


getSessionById() {
  this.loading = true;
  return new Promise((resolve, reject) => {
    const sessionID = this.sessionService.getSessionID();

    this.httpService
      .get(`session/getSessionById/${sessionID}/${ this.userDetials._id}`)
      .subscribe(
        (res: any) => {
          this.submitDetails = res.data;
          console.log('this.submitDetails', this.submitDetails)
          this.loading = false;
          resolve(res);
        },
        (error) => {
          this.loading = false;
          console.error('Error submitting answer:', error);
          reject(error);
        }
      );
  });
}
verifyQuestionAnswer() {
  this.loading = true;
  return new Promise((resolve, reject) => {
    const sessionID = this.sessionService.getSessionID();
   
    let sendData = {
      userId: this.userDetials?._id,     
      sessionId: sessionID,
    };

    this.httpService
      .post(`mockTestAttempt/closeActiveSession`, sendData)
      .subscribe(
        (res: any) => {
          this.loading = false;
          this.router.navigate(['/pages/result']);
          resolve(res);
        },
        (error) => {
          this.loading = false;
          console.error('Error submitting answer:', error);
          reject(error);
        }
      );
  });
}
}
