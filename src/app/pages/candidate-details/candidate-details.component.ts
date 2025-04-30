import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../shared/http/http.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrl: './candidate-details.component.css'
})
export class CandidateDetailsComponent implements OnInit {
  candidatureForm!: FormGroup;
  constructor(private fb: FormBuilder,
    private http: HttpService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.candidatureForm = this.fb.group({
      firstName: ['', [Validators.required]],
      laststName: ['', [Validators.required]],
      mobileNo: ['', [Validators.required,Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      language: ['', [Validators.required]],
      proficiency: ['', [Validators.required]],
      process: ['', [Validators.required]],
      client: ['', [Validators.required]],
    })
  }
  onSubmit() {
    if (this.candidatureForm.invalid) {
      this.candidatureForm.markAllAsTouched();
      return;
    }
    let objToSend: NavigationExtras = {
      queryParams: this.candidatureForm.value,
      skipLocationChange: false,
      fragment: 'top',
    };
    this.router.navigate(['/pages/data-page'], { state: objToSend });
  }

}
