import {Injectable, signal} from '@angular/core';
import {Toast, ToastType} from '../../interfaces/toast-type.interface';


@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toast = signal<Toast | null>(null);
  private nextId = 0;

  constructor() {
  }

  public info(message: string, duration = 2000): void {
    this.show(message, ToastType.INFO, duration);
  }

  public success(message: string, duration = 2000): void {
    this.show(message, ToastType.SUCCESS, duration);
  }

  public error(message: string, duration = 2000): void {
    this.show(message, ToastType.ERROR, duration);
  }

  public warning(message: string, duration = 2000): void {
    this.show(message, ToastType.WARNING, duration);
  }

  public clear(): void {
    this.toast.update(() => null);
  }

  private show(message: string, type: ToastType, duration = 2000): void {
    const toast: Toast = {
      id: this.nextId++,
      message,
      type,
      duration,
    };

    this.toast.update(() => toast);

    setTimeout(() => {
      this.clear();
    }, duration);
  }
}
