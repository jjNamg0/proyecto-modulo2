import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Homecomponent } from './components/homecomponent/homecomponent';
import { Listadocomponent } from './components/listadocomponent/listadocomponent';
import { Detallecomponent } from './components/detallecomponent/detallecomponent';
import { Misreservascomponent } from './components/misreservascomponent/misreservascomponent';
import { Logincomponent } from './components/logincomponent/logincomponent';
import { Registrocomponent } from './components/registrocomponent/registrocomponent';
<<<<<<< Updated upstream
=======
import { Favoritoscomponent } from './components/favoritoscomponent/favoritoscomponent';
import { Asistenteiacomponent } from './components/asistenteiacomponent/asistenteiacomponent';
import { Notfoundcomponent } from './components/notfoundcomponent/notfoundcomponent';
>>>>>>> Stashed changes

const routes: Routes = [
  {
    path: '',
    component: Homecomponent,
    title: 'Nocturna Stays — Inicio',
  },
  {
    path: 'listado',
    component: Listadocomponent,
    title: 'Nocturna Stays — Listado de alojamientos',
  },
  {
    path: 'alojamientos/:id',
    component: Detallecomponent,
    title: 'Nocturna Stays — Detalle del alojamiento',
  },
  {
    path: 'mis-reservas',
    component: Misreservascomponent,
    title: 'Nocturna Stays — Mis reservas',
  },
  {
    path: 'login',
    component: Logincomponent,
    title: 'Nocturna Stays — Iniciar sesión',
  },
  {
    path: 'registro',
    component: Registrocomponent,
    title: 'Nocturna Stays — Crear cuenta',
  },
<<<<<<< Updated upstream
=======
  {
    path: 'favoritos',
    component: Favoritoscomponent,
    title: 'Nocturna Stays — Favoritos',
  },
  {
    path: 'asistente-ia',
    component: Asistenteiacomponent,
    title: 'Nocturna Stays — Asistente IA',
  },
  {
    path: '**',
    component: Notfoundcomponent,
    title: 'Nocturna Stays — Página no encontrada',
  },

>>>>>>> Stashed changes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
