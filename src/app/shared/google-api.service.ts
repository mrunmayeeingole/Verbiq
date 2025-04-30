// // google-api.service.ts
// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class GoogleApiService {
//   private apiLoadedSubject = new BehaviorSubject<boolean>(false);
//   public apiLoaded$ = this.apiLoadedSubject.asObservable();

//   constructor() {
//     this.loadGoogleApi();
//   }

//   private loadGoogleApi() {
//     if (typeof google !== 'undefined' && google.load) {
//       google.load('elements', '1', {
//         packages: 'transliteration',
//         callback: () => this.apiLoadedSubject.next(true)
//       });
//     } else {
//       const script = document.createElement('script');
//       script.src = 'https://www.google.com/jsapi';
//       script.onload = () => {
//         google.load('elements', '1', {
//           packages: 'transliteration',
//           callback: () => this.apiLoadedSubject.next(true)
//         });
//       };
//       document.head.appendChild(script);
//     }
//   }
// }