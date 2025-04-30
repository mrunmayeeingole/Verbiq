import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CopyProtectionService {
  
  constructor() { }
  
  /**
   * Applies copy-paste restrictions to the specified elements
   * @param elementRef The ElementRef of the component
   * @param preventCopySelectors CSS selectors for elements to protect from copying
   * @param preventPasteSelectors CSS selectors for elements to protect from pasting
   */
  applyProtection(
    elementRef: ElementRef, 
    preventCopySelectors: string[] = ['.question-text', '.passage-text', '.justified-text'],
    preventPasteSelectors: string[] = ['textarea']
  ) {
    // Select all question content elements that should be protected
    const questionElements = elementRef.nativeElement.querySelectorAll(preventCopySelectors.join(', '));
    
    // Add event listeners to each element
    questionElements.forEach((element: HTMLElement) => {
      // Prevent copy
      element.addEventListener('copy', (e) => {
        e.preventDefault();
        return false;
      });
      
      // Prevent cut
      element.addEventListener('cut', (e) => {
        e.preventDefault();
        return false;
      });
      
      // Add user-select none style
      element.style.userSelect = 'none';
    });
    
    // Prevent paste on specified elements
    if (preventPasteSelectors.length > 0) {
      const pasteElements = elementRef.nativeElement.querySelectorAll(preventPasteSelectors.join(', '));
      pasteElements.forEach((element: HTMLElement) => {
        element.addEventListener('paste', (e) => {
          e.preventDefault();
          return false;
        });
      });
    }
  }
  
  /**
   * Removes the copy-paste restrictions from specified elements
   * @param elementRef The ElementRef of the component
   * @param selectors CSS selectors for elements to remove protection from
   */
  removeProtection(
    elementRef: ElementRef,
    selectors: string[] = ['.question-text', '.passage-text', '.justified-text', 'textarea']
  ) {
    const elements = elementRef.nativeElement.querySelectorAll(selectors.join(', '));
    
    elements.forEach((element: HTMLElement) => {
      // Remove the event listeners and styling
      element.style.userSelect = '';
      
      // Note: Since we can't directly remove event listeners added anonymously,
      // we would need to clone the element to remove the listeners
      const newElement = element.cloneNode(true);
      if (element.parentNode) {
        element.parentNode.replaceChild(newElement, element);
      }
    });
  }
}