import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbarcomponent } from './components/navbarcomponent/navbarcomponent';
import { Footercomponent } from './components/footercomponent/footercomponent';
import { Homecomponent } from './components/homecomponent/homecomponent';
import { Listadocomponent } from './components/listadocomponent/listadocomponent';
import { Filtrospanelcomponent } from './components/filtrospanelcomponent/filtrospanelcomponent';
import { Detallecomponent } from './components/detallecomponent/detallecomponent';

@NgModule({
  declarations: [
    App,
    Navbarcomponent,
    Footercomponent,
    Homecomponent,
    Listadocomponent,
    Filtrospanelcomponent,
    Detallecomponent,
  ],
  imports: [BrowserModule, CommonModule, FormsModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
