import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toastservice';

@Component({
  selector: 'app-toastcomponent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toastcomponent.html',
  styleUrl: './toastcomponent.css'
})
export class Toastcomponent {
  constructor(public toastService: ToastService) {}
}
