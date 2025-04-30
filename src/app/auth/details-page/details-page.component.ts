import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../shared/http/http.service';
import { AuthenticationService } from '../../shared/authentication.service';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.css'
})
export class DetailsPageComponent implements OnInit {
  candidatureForm!: FormGroup;
  qParams: any;
  user: any;
  constructor(private fb: FormBuilder, private router: Router, private http: HttpService , private authenticationService: AuthenticationService) {
    this.qParams = this.router.getCurrentNavigation()?.extras.state?.['queryParams'];
    console.log('this.qParams', this.qParams)
  }
  
  ngOnInit(): void {
    this.user =  this.http.getUserDetails()?.data?._id;
    console.log('this.user', this.user)
    this.candidatureForm = this.fb.group({
      experience: ['', [Validators.required]],
      currentLocation: ['', [Validators.required]],
      processLocation: ['', [Validators.required]],
      roleType: ['', [Validators.required]],
      thirdPartyAssessment: ['', [Validators.required]],
      scoreInThirdPartyAssessment: ['', [Validators.required]],
      regionalLanguages: ['', [Validators.required]],
      foreignLanguages: ['', [Validators.required]],
    })
  }

  onSubmit() {
    if (this.candidatureForm.invalid) {
      this.candidatureForm.markAllAsTouched();
      return;
    }
    const formData = { ...this.candidatureForm.value, ...this.qParams };
    console.log("formData", formData)
    this.http.put(`studentRegistration/updateStudentRegistration`,this.user , formData).subscribe({
      next: (response) => {
        console.log(response);
        this.authenticationService.isAuthenticated.next(true);
        this.router.navigate(['/pages/proceed']);
      },
      error: (err) => {
        console.log(err)
      }
      
    })
  }
}
