import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toastservice';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toastcomponent.html',
  styleUrl: './toastcomponent.css'
})
export class ToastComponent {

  private toastService = inject(ToastService);

  toast$ = this.toastService.toast$;

  close() {
    this.toastService.clear();
  }
}


