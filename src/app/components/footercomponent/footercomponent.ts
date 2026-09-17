import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-footercomponent',
  styleUrl: './footercomponent.css',
  templateUrl: './footercomponent.html',
})
export class Footercomponent {
  readonly anioActual = new Date().getFullYear();
}
