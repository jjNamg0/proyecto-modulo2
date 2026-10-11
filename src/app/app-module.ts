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
import { Perfilcomponent } from './components/perfilcomponent/perfilcomponent';
import { Iaopinioncomponent } from './components/iaopinioncomponent/iaopinioncomponent';
import { Toastcomponent } from './components/toastcomponent/toastcomponent';
import { Terminoscomponent } from './components/terminoscomponent/terminoscomponent';
import { Privacidadcomponent } from './components/privacidadcomponent/privacidadcomponent';
import { Comprobantecomponent } from './components/comprobantecomponent/comprobantecomponent';
import { Comparadorcomponent } from './components/comparadorcomponent/comparadorcomponent';
import { Comparadorbarracomponent } from './components/comparadorbarracomponent/comparadorbarracomponent';
import { Contactocomponent } from './components/contactocomponent/contactocomponent';
import { Mapamundicomponent } from './components/mapamundicomponent/mapamundicomponent';

import {
  TranslatePipe,
  TranslateDirective,
  provideTranslateService,
} from '@ngx-translate/core';

import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

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
    Perfilcomponent,
    Iaopinioncomponent,
    Toastcomponent,
    Terminoscomponent,
    Privacidadcomponent,
    Comprobantecomponent,
    Comparadorcomponent,
    Comparadorbarracomponent,
    Contactocomponent,
    Mapamundicomponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    TranslatePipe,
    TranslateDirective,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'es',
    }),
  ],
  bootstrap: [App],
})
export class AppModule {}