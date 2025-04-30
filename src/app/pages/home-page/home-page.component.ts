import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page', 
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  activeStage: string = 'Reading';
  userDetials: any;
  isBookmarked: boolean = false;
  loading: boolean = false;
  typesData: any;
  activeType: any;
  activeId: any;
  questionDetails: any;


 constructor(private http: HttpClient ,private httpService : HttpService , private router :Router) {}

  ngOnInit() {
    this.getAllTypes();
    this.userDetials = this.httpService.getUserDetails()?.data;
    console.log('this.userDetials', this.userDetials)
    this.isBookmarked = localStorage.getItem('bookmark') === 'true';
  }
  

 getAllTypes() { 
  this.loading = true;
    this.httpService.get('types/getAllTypes').subscribe(
      (res: any) => {
        this.loading = false;
        this.typesData = res.data;
        console.log('Types:', this.typesData);
        if (this.typesData.length > 0) {
          const firstType = this.typesData[0];
          this.setActiveType(firstType.name, firstType._id);
        }
      },
      (error) => {
        this.loading = false;
        console.error('Error fetching data:', error);
      }
    );
  }


  setActiveType(typeName: string, typeId: string) {
    this.activeStage = typeName;  // Update active stage
    this.activeId = typeId;
    console.log('Active Stage:', this.activeStage);
    this.getNextQuestionsById();
  }

 getNextQuestionsById() {  
  this.loading = true;
  this.httpService.get(`questions/getNextQuestionsById/${this.activeId}/${this.userDetials?.language}/${this.userDetials?._id}`).subscribe(
    (res: any) => {
        this.loading = false;
        this.questionDetails = res.data;
        console.log('Types:', this.typesData);
      },
      (error) => {
        this.loading = false;
        console.error('Error fetching data:', error);
      }
    );
  }
}
