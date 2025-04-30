import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[preventRightClick]'
})
export class PreventRightClickDirective {
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
    return false;
  }
}