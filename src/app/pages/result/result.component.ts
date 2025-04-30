import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables, ChartConfiguration, ScriptableContext } from 'chart.js';
import { HttpService } from '../../shared/http/http.service';

// Register all Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {
  @ViewChild('proficiencyChart') private chartRef!: ElementRef;
  currentDate = new Date();
  confirmationId = '';
  chart: Chart | undefined;
  
  // CEFR levels for y-axis
  cefrLevels = ['<A1', 'A1', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C2'];
  loading: boolean = false;
  
  // Scores for each category
  scores = {
    sentenceMastery: 62,
    vocabulary: 64,
    fluency: 49,
    pronunciation: 69
  };
  typesData: any;
  userDetials: any;
  assessmentResults: any;
  
  constructor(
    private httpService: HttpService,
  ) {
    this.userDetials = this.httpService.getUserDetails()?.data;
        this.getMockTestAttemptById(this.userDetials._id);

   }
  
  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOninit(){
    this.confirmationId = this.generateConfirmationId();
    this.getMockTestAttemptById(this.userDetials._id);
  }

  generateConfirmationId(): string {
    return 'EX-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  
  // returnToDashboard(): void {
  //   this.router.navigate(['/dashboard']);
  // }

  getMockTestAttemptById(id:any){
    this.loading = true;
    this.httpService.get(`mockTestAttempt/getMockTestAttemptById/${id}`).subscribe(
      (res: any) => {
        this.typesData = res.data;
        console.log('Types:', this.typesData);
        if (this.typesData.languageAssessmentData) {
          this.processLanguageAssessmentData(this.typesData.languageAssessmentData);
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Error fetching data:', error);
      }
    );

  }

  processLanguageAssessmentData(data: any) {
    this.assessmentResults = [];
  
    let currentKey: string | null = null;
  
    Object.keys(data).forEach((key) => {
      if (!currentKey) {
        currentKey = key;
      } else {
        this.assessmentResults.push({
          title: currentKey,
          value: key
        });
        currentKey = data[key];
      }
    });
  
    console.log("Processed Assessment Data:", this.assessmentResults);
  }
  
  createChart(): void {
    if (!this.chartRef) return;
    
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    
    // Create the benchmark line value (59 in the example)
    const benchmarkValue = 59;
    
    // Define chart configuration
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['Sentence Mastery', 'Vocabulary', 'Fluency', 'Pronunciation'],
        datasets: [
          {
            label: 'Score',
            data: [
              this.scores.sentenceMastery, 
              this.scores.vocabulary, 
              this.scores.fluency, 
              this.scores.pronunciation
            ],
            backgroundColor: [
              '#0066A1', // Blue for Sentence Mastery
              '#00838F', // Teal for Vocabulary
              '#6A359C', // Purple for Fluency
              '#9C2760'  // Magenta for Pronunciation
            ],
            borderWidth: 0,
            borderRadius: 0,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 50,
            top: 60, // Increased top padding to make room for circles
            bottom: 10,
            right: 10
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        scales: {
          y: {
            min: 10,
            max: 90,
            grid: {
              color: '#f0f0f0'
            },
            ticks: {
              stepSize: 10,
              callback: function(tickValue: number | string) {
                const numValue = Number(tickValue);
                if (!isNaN(numValue) && numValue % 10 === 0) {
                  return tickValue.toString();
                }
                return '';
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      },
      plugins: [{
        id: 'customLabels',
        afterDraw: (chart) => {
          const ctx = chart.ctx;
          ctx.save();
          
          // Draw CEFR levels on the left
          const cefrX = chart.chartArea.left - 40;
          const cefrStep = chart.chartArea.height / 8;
          const cefrStart = chart.chartArea.bottom - cefrStep;
          
          this.cefrLevels.forEach((level, i) => {
            if (i % 1 === 0) {
              const y = cefrStart - (i * cefrStep * 0.89);
              
              // Draw level background
              const bgWidth = 25;
              const bgHeight = cefrStep * 0.89;
              ctx.fillStyle = '#777';
              ctx.fillRect(cefrX - bgWidth/2, y - (bgHeight/2) - 6, bgWidth, bgHeight);
              
              // Draw level text on top
              ctx.fillStyle = 'white';
              ctx.font = '12px Arial';
              ctx.textAlign = 'center';
              ctx.fillText(level, cefrX, y);
            }
          });
          
          // Draw benchmark circle with "59" inside
          const yScale = chart.scales['y'];
          if (yScale) {
            const benchmarkY = yScale.getPixelForValue(benchmarkValue);
            const meta = chart.getDatasetMeta(0);
            if (meta && meta.data && meta.data.length > 0) {
              const firstBarX = meta.data[0].x;
              
              ctx.beginPath();
              ctx.arc(firstBarX - 30, benchmarkY, 15, 0, Math.PI * 2);
              ctx.fillStyle = 'white';
              ctx.strokeStyle = '#FFA500';
              ctx.lineWidth = 2;
              ctx.fill();
              ctx.stroke();
              
              ctx.fillStyle = '#000';
              ctx.font = 'bold 12px Arial';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(benchmarkValue.toString(), firstBarX - 30, benchmarkY);
            }
          }
          
          // Draw score values on top of each bar
          const yAxisScale = chart.scales['y'];
          if (yAxisScale) {
            chart.data.datasets[0].data.forEach((dataValue, i) => {
              const meta = chart.getDatasetMeta(0);
              if (meta && meta.data && meta.data.length > i) {
                const x = meta.data[i].x;
                const value = dataValue as number; // Assert as number
                const y = yAxisScale.getPixelForValue(value) - 10;
                
                ctx.fillStyle = 'white';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(value.toString(), x, y);
              }
            });
          }
          
          // Draw category labels with colored bubbles ABOVE the chart
          // This is the key change to match your image
          const categories = [
            { name: 'Sentence Mastery', score: this.scores.sentenceMastery, color: '#0066A1' },
            { name: 'Vocabulary', score: this.scores.vocabulary, color: '#00838F' },
            { name: 'Fluency', score: this.scores.fluency, color: '#6A359C' },
            { name: 'Pronunciation', score: this.scores.pronunciation, color: '#9C2760' }
          ];
          
          // Use the x positions of the bars to align the circles
          const meta = chart.getDatasetMeta(0);
          if (meta && meta.data && meta.data.length > 0) {
            categories.forEach((category, i) => {
              if (meta.data.length > i) {
                const x = meta.data[i].x; // Use the x position of each bar
                const circleY = chart.chartArea.top - 25; // Position above the chart area
                
                // Draw colored circle with score
                ctx.beginPath();
                ctx.arc(x, circleY, 15, 0, Math.PI * 2);
                ctx.fillStyle = category.color;
                ctx.fill();
                
                // Draw score number
                ctx.fillStyle = 'white';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(category.score.toString(), x, circleY);
                
                // Draw category name
                ctx.fillStyle = '#000';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(category.name, x, circleY + 25); // Position below the circle
              }
            });
          }
          
          ctx.restore();
        }
      }]
    };
    
    this.chart = new Chart(ctx, config);
  }
}
