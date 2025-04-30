import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, title?: string) {
    this.toastr.success(message, title, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right',
      toastClass: 'ngx-toastr success-toast',
      titleClass: 'toast-title',
      messageClass: 'toast-message'
    });
  }

  showError(message: string, title?: string) {
    this.toastr.error(message, title, {
      timeOut: 5000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right',
      toastClass: 'ngx-toastr error-toast',
      titleClass: 'toast-title',
      messageClass: 'toast-message'
    });
  }

  showWarning(message: string, title?: string) {
    this.toastr.warning(message, title, {
      timeOut: 4000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right',
      toastClass: 'ngx-toastr warning-toast',
      titleClass: 'toast-title',
      messageClass: 'toast-message'
    });
  }

  showInfo(message: string, title?: string) {
    this.toastr.info(message, title, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right',
      toastClass: 'ngx-toastr info-toast',
      titleClass: 'toast-title',
      messageClass: 'toast-message'
    });
  }
}
