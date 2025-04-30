
// // pdf.service.ts

// import { Injectable } from '@angular/core';
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import html2canvas from 'html2canvas';
// import { HttpService } from './http/http.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class PdfService {
//   private customFontUrl = 'assets/fonts/Shivaji01.ttf'; // Update the path to your font file
//   paymentHistory: any;
//   currentDate = new Date();
//   formattedDate = this.formatDate(this.currentDate);
//   formattedTime = this.formatTime(this.currentDate);
//   fileHeadName = `${this.formattedDate}-${this.formattedTime}`;

//   constructor(private httpService: HttpService) {
//   }

//   generateBalanceReportPDF(data: any[]) {
//     const doc = new jsPDF();

//     doc.setFont('arial');

//     autoTable(doc, {
//       body: [
//         [
//           {
//             content: 'ALL Test Series',
//             colSpan: 2,
//             styles: {
//               halign: 'left',
//               fontSize: 18,
//               textColor: '#2C3761'
//             }
//           },
//           {
//             content: `Report - ${this.formattedDate}`,
//             colSpan: 2,
//             styles: {
//               halign: 'right',
//               fontSize: 18,
//               textColor: '#2C3761'
//             }
//           }
//         ],
//       ],
//       theme: 'plain',
//       styles: {
//         fillColor: '#ffffff'
//       }
//     });

//     // Adding serial numbers (sr) to the data
//     for (let i = 0; i < data.length; i++) {
//         data[i]['sr'] = i + 1;
//     }

//     autoTable(doc, {
//       head: [['Sr', 'User Name', 'Mobile', 'Email']], // Adjust head accordingly
//       body: data.map(item => [item.sr, item.userName, item.mobile, item.email]),
//       headStyles: {
//         fillColor: '#2C3761'
//       }
//     });

//     return doc.save(`Report_${this.fileHeadName}.pdf`);
// }


//   generateCoordiantorReport(data: any[]) {
//     const doc = new jsPDF();

//     doc.setFont('arial');

//     autoTable(doc, {
//       body: [
//         [
//           {
//             content: 'Learn And Achieve - Coordinator',
//             styles: {
//               halign: 'left',
//               fontSize: 16,
//               textColor: '#2C3761'
//             }
//           },
//           {
//             content: `Report - ${this.formattedDate}`,
//             styles: {
//               halign: 'right',
//               fontSize: 18,
//               textColor: '#2C3761'
//             }
//           }
//         ],
//       ],
//       theme: 'plain',
//       styles: {
//         fillColor: '#ffffff'
//       }
//     });

//     autoTable(doc, {
//       head: [['User Name', 'DOB','Age','Email','Mobile No','Coordinator Code']],
//       body: this.bindValue(data),
//       headStyles: {
//         fillColor: '#2C3761'
//       }
//     });

//     return doc.save(`Report_${this.fileHeadName}.pdf`);
//   }

//   bindUserValue(data: any) {
//     console.log('data', data);
//     let formattedData: any[] = [];
//     data.forEach((element: any, index: number) => {
//         formattedData.push([index + 1, element.userName, element.email, element.mobileNo]);
//     });
//     return formattedData;
// }



//   bindValue(data:any) {
//     console.log('data', data)
//     let formatedData:any = [];
//     data.forEach((element:any) => {
//       formatedData.push([element.userName, element.email,element.mobileNo])
//     });
//     return formatedData;
//   }

//   formatDateForPDF(dateString: string): string {
//     // Check if dateString is a valid date string
//     if (!dateString || isNaN(Date.parse(dateString))) {
//       return ''; // or handle the error in an appropriate way
//     }

//     const date = new Date(dateString);
//     const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
//     return new Intl.DateTimeFormat('en-GB', options).format(date);
//   }

//   private formatDate(date: Date): string {
//     const day = ('0' + date.getDate()).slice(-2) as string;
//     const month = ('0' + (date.getMonth() + 1)).slice(-2) as string;
//     const year = date.getFullYear().toString();
//     return `${day}-${month}-${year}`;
//   }

//   private formatTime(date: Date): string {
//     const hours = ('0' + (date.getHours() % 12) || 12)
//       .toString()
//       .slice(-2) as string;
//     const minutes = ('0' + date.getMinutes()).slice(-2) as string;
//     const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
//     return `${hours}-${minutes}-${ampm}`;
//   }
// }
