# Nocturna Stays

Marketplace de alojamientos hecho en Angular para el curso Desarrollo de Sistemas de Información 3, Universidad El Bosque.

## Descripción

Aplicación web (solo frontend) donde un huésped puede ver alojamientos, filtrarlos, ver su detalle, cotizar una estancia, simular una reserva y consultar sus reservas. Los datos salen de un archivo JSON y todo lo que se crea (cuentas, reservas, favoritos) se guarda en memoria, así que se borra al recargar la página.

## Integrantes

- Juan José Arango Avila
- Daniel Alejandro Campos
- Daniel Fernando Montoya Corredor

## Tecnologías

- Angular 22 y TypeScript
- Bootstrap 5, Font Awesome, animate.css y SweetAlert2
- APIs públicas: geocode.maps.co, Open-Meteo, open.er-api.com, Nager.Date y Gemini (opcional)

## Funcionalidades

- Página inicial con alojamientos destacados
- Listado con filtros por ciudad, huéspedes, tipo y precio
- Detalle del alojamiento con mapa, clima y reseñas
- Cotización con noches, subtotal, limpieza, tarifa de servicio (10 %) y total
- Reserva simulada con pago, cupones y comprobante
- Mis reservas, con opción de cancelar
- Registro, inicio de sesión, perfil, favoritos, comparador y publicar alojamientos

## Estructura

src/app/
├── components/   componentes de la app
├── services/     acceso a datos y APIs
├── app-module.ts
└── app-routing-module.ts
public/assets/
├── data/marketplace-data.json   datos de alojamientos y reseñas
└── images/                      fotos de los alojamientos
```

Las fotos de los alojamientos son ilustrativas y vienen de Unsplash.
