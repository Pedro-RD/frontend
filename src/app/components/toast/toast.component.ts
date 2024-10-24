import {Component, computed, OnInit} from '@angular/core';
import {ToastType} from '../../interfaces/toast-type.interface';
import {NgClass, NgIf} from '@angular/common';
import {ToastService} from '../../services/toast/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    NgClass,
    NgIf
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit {
  toast = computed(() => this.toastService.toast())

  constructor(private toastService: ToastService) {
  }

  get icon() {
    switch (this.toast()?.type) {
      case ToastType.SUCCESS:
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case ToastType.ERROR:
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
      case ToastType.WARNING:
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  get color() {
    switch (this.toast()?.type) {
      case ToastType.SUCCESS:
        return 'alert-success';
      case ToastType.ERROR:
        return 'alert-error';
      case ToastType.WARNING:
        return 'alert-warning';
      default:
        return 'alert-info';
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.toastService.clear();
    }, this.toast()?.duration);
  }
}
