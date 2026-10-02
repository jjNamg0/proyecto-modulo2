import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  text: string;
  type: 'success' | 'error' | 'warning';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  private timer: ReturnType<typeof setTimeout> | null = null;

  toast$ = this.toastSubject.asObservable();

  success(text: string) { this.show(text, 'success'); }
  error(text: string) { this.show(text, 'error'); }
  warning(text: string) { this.show(text, 'warning'); }

  private show(text: string, type: ToastMessage['type']) {
    if (this.timer) clearTimeout(this.timer);
    this.toastSubject.next({ text, type });
    this.timer = setTimeout(() => this.clear(), 3000);
  }

  clear() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.toastSubject.next(null);
  }
}
