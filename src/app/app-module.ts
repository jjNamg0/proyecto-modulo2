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
import { Cotizadorcomponent } from './components/cotizadorcomponent/cotizadorcomponent';
import { Pagocomponent } from './components/pagocomponent/pagocomponent';
import { Misreservascomponent } from './components/misreservascomponent/misreservascomponent';
import { Logincomponent } from './components/logincomponent/logincomponent';
import { Registrocomponent } from './components/registrocomponent/registrocomponent';
import { Favoritoscomponent } from './components/favoritoscomponent/favoritoscomponent';
import { Notfoundcomponent } from './components/notfoundcomponent/notfoundcomponent';
import { Resenaformcomponent } from './components/resenaformcomponent/resenaformcomponent';
import { Publicarcomponent } from './components/publicarcomponent/publicarcomponent';

@NgModule({
  declarations: [
    App,
    Navbarcomponent,
    Footercomponent,
    Homecomponent,
    Listadocomponent,
    Filtrospanelcomponent,
    Detallecomponent,
    Cotizadorcomponent,
    Pagocomponent,
    Misreservascomponent,
    Logincomponent,
    Registrocomponent,
    Favoritoscomponent,
    Notfoundcomponent,
    Resenaformcomponent,
    Publicarcomponent,
  ],
  imports: [BrowserModule, CommonModule, FormsModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
