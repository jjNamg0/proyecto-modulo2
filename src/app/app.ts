import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbarcomponent } from './components/navbarcomponent/navbarcomponent';
import { Footercomponent } from './components/footercomponent/footercomponent';

@Component({
  imports: [RouterOutlet, Navbarcomponent, Footercomponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
