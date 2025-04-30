import { ElementRef, Injectable } from "@angular/core";
import { AppConfigConstants } from "./constants/global.const";
// import { AppConfigConstants } from "../constants/global.const";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  public appConfig = AppConfigConstants.APP_CONFIG;
  showSpinner : any;
     constructor(private elementRef: ElementRef) { }

  disableCopyPaste() {
    const questionElements = this.elementRef.nativeElement.querySelectorAll('.question-text, .passage-text, .justified-text');
    questionElements.forEach((element: HTMLElement) => {
      element.addEventListener('copy', (e) => {
        e.preventDefault();
        return false;
      });
      
      element.addEventListener('cut', (e) => {
        e.preventDefault();
        return false;
      });
      element.style.userSelect = 'none';
    });
    const answerTextarea = this.elementRef.nativeElement.querySelector('textarea');
    if (answerTextarea) {
      answerTextarea.addEventListener('paste', (e : any) => {
        e.preventDefault();
        return false;
      });
    }
  }

}
